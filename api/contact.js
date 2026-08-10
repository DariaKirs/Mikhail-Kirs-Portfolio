import crypto from 'node:crypto';

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;
const RESEND_TIMEOUT_MS = 5000;
const rateBuckets = new Map();

const canonicalOrigins = new Set([
  'https://www.mikhailkirs.com',
  'https://mikhailkirs.com',
  'https://mikhail-kirs-portfolio.vercel.app'
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
      'X-MK-Contact-API': '20260810-1455'
    }
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded?.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || 'unknown';
}

function isAllowedOrigin(request) {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  if (canonicalOrigins.has(origin)) return true;

  try {
    const requestOrigin = new URL(request.url).origin;
    if (origin === requestOrigin) return true;

    const forwardedHost = request.headers.get('x-forwarded-host');
    const forwardedProto = request.headers.get('x-forwarded-proto') || 'https';
    if (forwardedHost && origin === `${forwardedProto}://${forwardedHost}`) return true;
  } catch {
    return false;
  }

  return false;
}

function isRateLimited(ip) {
  const now = Date.now();
  const recent = (rateBuckets.get(ip) || []).filter((time) => now - time < RATE_WINDOW_MS);

  if (recent.length >= RATE_LIMIT) {
    rateBuckets.set(ip, recent);
    return true;
  }

  recent.push(now);
  rateBuckets.set(ip, recent);

  if (rateBuckets.size > 500) {
    for (const [key, timestamps] of rateBuckets.entries()) {
      if (!timestamps.some((time) => now - time < RATE_WINDOW_MS)) {
        rateBuckets.delete(key);
      }
    }
  }

  return false;
}

function cleanName(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function makeRequestId(name, email, message, startedAt) {
  return crypto
    .createHash('sha256')
    .update(`${name}|${email}|${message}|${startedAt}`)
    .digest('hex')
    .slice(0, 40);
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function sendThroughResend(apiKey, payload, idempotencyKey) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const raw = await response.text();
    let result = {};
    try {
      result = raw ? JSON.parse(raw) : {};
    } catch {
      result = {};
    }

    if (!response.ok) {
      const error = new Error(result?.message || result?.error?.message || 'Resend rejected the email request.');
      error.status = response.status;
      error.code = result?.name || result?.error?.name || '';
      throw error;
    }

    return result;
  } finally {
    clearTimeout(timeout);
  }
}

function isRetryableResendError(error) {
  if (error?.name === 'AbortError' || error instanceof TypeError) return true;
  const status = Number(error?.status);
  if (status === 409 && error?.code === 'concurrent_idempotent_requests') return true;
  return status >= 500 && status <= 599;
}

async function sendWithRetry(apiKey, payload, idempotencyKey) {
  let lastError;
  const delays = [0, 500, 1000];

  for (let attempt = 0; attempt < delays.length; attempt += 1) {
    if (delays[attempt]) await wait(delays[attempt]);

    try {
      return await sendThroughResend(apiKey, payload, idempotencyKey);
    } catch (error) {
      lastError = error;
      if (!isRetryableResendError(error) || attempt === delays.length - 1) {
        throw error;
      }
    }
  }

  throw lastError || new Error('Unable to send email.');
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed.' }, 405);
    }

    if (!isAllowedOrigin(request)) {
      return json({ error: 'Request origin is not allowed.' }, 403);
    }

    const contentType = String(request.headers.get('content-type') || '');
    if (!contentType.toLowerCase().startsWith('application/json')) {
      return json({ error: 'Unsupported request type.' }, 415);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid request.' }, 400);
    }

    const name = cleanName(body.name);
    const email = String(body.email || '').trim().toLowerCase();
    const message = String(body.message || '').trim();
    const website = String(body.website || '').trim();
    const consent = body.consent === true;
    const startedAt = Number(body.startedAt);

    if (website) {
      return json({ ok: true });
    }

    if (
      name.length < 2 ||
      name.length > 80 ||
      email.length > 254 ||
      !emailPattern.test(email) ||
      message.length < 10 ||
      message.length > 4000 ||
      !consent
    ) {
      return json({ error: 'Please check the form fields and try again.' }, 400);
    }

    const formAge = Date.now() - startedAt;
    if (!Number.isFinite(startedAt) || formAge < 1200 || formAge > 2 * 60 * 60 * 1000) {
      return json({ error: 'Please reopen the form and try again.' }, 400);
    }

    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return json({ error: 'Too many messages were sent recently. Please try again in a few minutes.' }, 429);
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY is not configured.');
      return json({ error: 'Messaging is temporarily unavailable. Please try again later.' }, 503);
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message).replaceAll('\n', '<br>');
    const requestId = makeRequestId(name, email, message, startedAt);
    const idempotencyKey = `portfolio-contact/${requestId}`;

    const emailPayload = {
      from: 'Mikhail Kirs Portfolio <contact@mikhailkirs.com>',
      to: ['mikhail.kirs.ca@gmail.com'],
      reply_to: email,
      subject: `Portfolio inquiry from ${name}`,
      text: `New portfolio inquiry\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif;color:#20364A;line-height:1.55;max-width:680px;margin:0 auto;padding:24px;">
          <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#69418C;">Mikhail Kirs Portfolio</p>
          <h1 style="margin:0 0 24px;font-size:28px;line-height:1.15;">New project inquiry</h1>
          <p style="margin:0 0 8px;"><strong>Name:</strong> ${safeName}</p>
          <p style="margin:0 0 24px;"><strong>Email:</strong> ${safeEmail}</p>
          <div style="padding:20px;border:1px solid #D8E9EE;border-radius:20px 10px 20px 10px;background:#F4EFE6;">${safeMessage}</div>
          <p style="margin:24px 0 0;font-size:13px;color:#5F6D78;">Replying to this email will reply directly to ${safeEmail}.</p>
        </div>
      `,
      tags: [{ name: 'source', value: 'portfolio_contact' }]
    };

    try {
      const result = await sendWithRetry(apiKey, emailPayload, idempotencyKey);
      return json({ ok: true, requestId, emailId: result.id || null });
    } catch (error) {
      console.error('Contact endpoint failure:', {
        name: error?.name,
        message: error?.message,
        status: error?.status,
        code: error?.code,
        requestId
      });

      if (error?.name === 'AbortError') {
        return json({ error: 'Email delivery timed out. Please try again in a moment.', requestId }, 504);
      }

      const status = Number(error?.status);
      if (status >= 400 && status < 500 && status !== 409) {
        return json({ error: 'Unable to send your message right now. Please check the address and try again.', requestId }, 502);
      }

      return json({ error: 'Unable to confirm email delivery right now. Please try again in a moment.', requestId }, 502);
    }
  }
};

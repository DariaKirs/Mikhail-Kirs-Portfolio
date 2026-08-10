import crypto from 'node:crypto';
import { Resend } from 'resend';

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;
const rateBuckets = new Map();

const allowedOrigins = new Set([
  'https://www.mikhailkirs.com',
  'https://mikhailkirs.com',
  'https://mikhail-kirs-portfolio.vercel.app'
]);

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getClientIp(request) {
  const forwarded = request.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim();
  }
  return request.socket?.remoteAddress || 'unknown';
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

function makeRequestId(email, message) {
  return crypto
    .createHash('sha256')
    .update(`${email}|${message}|${Date.now()}|${crypto.randomUUID()}`)
    .digest('hex')
    .slice(0, 40);
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const origin = request.headers.origin;
  if (!origin || !allowedOrigins.has(origin)) {
    return response.status(403).json({ error: 'Request origin is not allowed.' });
  }

  const contentType = String(request.headers['content-type'] || '');
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return response.status(415).json({ error: 'Unsupported request type.' });
  }

  let body;
  try {
    body = request.body || {};
  } catch {
    return response.status(400).json({ error: 'Invalid request.' });
  }

  const name = cleanName(body.name);
  const email = String(body.email || '').trim().toLowerCase();
  const message = String(body.message || '').trim();
  const website = String(body.website || '').trim();
  const consent = body.consent === true;
  const startedAt = Number(body.startedAt);

  /* Honeypot: quietly accept automated submissions without sending mail. */
  if (website) {
    return response.status(200).json({ ok: true });
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
    return response.status(400).json({ error: 'Please check the form fields and try again.' });
  }

  /* A real user cannot meaningfully complete the form immediately after opening it. */
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1200 || Date.now() - startedAt > 2 * 60 * 60 * 1000) {
    return response.status(400).json({ error: 'Please reopen the form and try again.' });
  }

  const ip = getClientIp(request);
  if (isRateLimited(ip)) {
    return response.status(429).json({ error: 'Too many messages were sent recently. Please try again in a few minutes.' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not configured.');
    return response.status(503).json({ error: 'Messaging is temporarily unavailable. Please try again later.' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br>');
  const requestId = makeRequestId(email, message);

  try {
    const { error } = await resend.emails.send(
      {
        from: 'Mikhail Kirs Portfolio <contact@mikhailkirs.com>',
        to: ['mikhail.kirs.ca@gmail.com'],
        replyTo: email,
        subject: `Portfolio inquiry from ${name}`,
        text: `New portfolio inquiry\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n`,
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;color:#20364A;line-height:1.55;max-width:680px;margin:0 auto;padding:24px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#69418C;">Mikhail Kirs Portfolio</p>
            <h1 style="margin:0 0 24px;font-size:28px;line-height:1.15;">New project inquiry</h1>
            <p style="margin:0 0 8px;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin:0 0 24px;"><strong>Email:</strong> ${safeEmail}</p>
            <div style="padding:20px;border:1px solid #D8E9EE;border-radius:20px 10px 20px 10px;background:#F4EFE6;">
              ${safeMessage}
            </div>
            <p style="margin:24px 0 0;font-size:13px;color:#5F6D78;">Replying to this email will reply directly to ${safeEmail}.</p>
          </div>
        `,
        tags: [
          { name: 'source', value: 'portfolio_contact' }
        ]
      },
      {
        idempotencyKey: `portfolio-contact/${requestId}`
      }
    );

    if (error) {
      console.error('Resend contact error:', error);
      return response.status(502).json({ error: 'Unable to send your message right now. Please try again.' });
    }

    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error('Contact endpoint failure:', error);
    return response.status(502).json({ error: 'Unable to send your message right now. Please try again.' });
  }
}

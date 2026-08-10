import { Resend } from 'resend';

const CONTACT_ADDRESS = 'contact@mikhailkirs.com';
const FORWARD_ADDRESS = 'mikhail.kirs.ca@gmail.com';
const MAX_FORWARDED_ATTACHMENTS = 5;
const MAX_FORWARDED_ATTACHMENT_BYTES = 25 * 1024 * 1024;

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function stripHtml(value) {
  return String(value || '')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed.' }, 405);
    }

    const apiKey = process.env.RESEND_INBOUND_API_KEY;
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

    if (!apiKey || !webhookSecret) {
      console.error('Inbound email environment variables are not fully configured.');
      return json({ error: 'Inbound email is not configured.' }, 503);
    }

    const svixId = request.headers.get('svix-id');
    const svixTimestamp = request.headers.get('svix-timestamp');
    const svixSignature = request.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      return json({ error: 'Missing webhook signature.' }, 400);
    }

    const rawPayload = await request.text();
    const resend = new Resend(apiKey);

    let event;
    try {
      event = await resend.webhooks.verify({
        payload: rawPayload,
        headers: {
          id: svixId,
          timestamp: svixTimestamp,
          signature: svixSignature
        },
        webhookSecret
      });
    } catch {
      return json({ error: 'Invalid webhook signature.' }, 400);
    }

    if (event?.type !== 'email.received') {
      return json({ ok: true, ignored: true });
    }

    const recipients = Array.isArray(event.data?.to)
      ? event.data.to.map((address) => String(address).toLowerCase())
      : [];

    if (!recipients.includes(CONTACT_ADDRESS)) {
      return json({ ok: true, ignored: true });
    }

    const emailId = event.data?.email_id;
    if (!emailId) {
      return json({ error: 'Missing email id.' }, 400);
    }

    const { data: received, error: retrieveError } = await resend.emails.receiving.get(emailId);

    if (retrieveError || !received) {
      console.error('Unable to retrieve received email:', retrieveError || 'unknown error');
      return json({ error: 'Unable to retrieve received email.' }, 502);
    }

    const originalFrom = String(received.from || event.data?.from || 'Unknown sender');
    const replyTo = Array.isArray(received.reply_to) && received.reply_to.length
      ? received.reply_to[0]
      : originalFrom;
    const subject = String(received.subject || event.data?.subject || '(no subject)').slice(0, 300);
    const bodyText = String(received.text || '').trim() || stripHtml(received.html) || '(No readable message body.)';

    const forwardedAttachments = [];
    let forwardedBytes = 0;
    const attachmentMetadata = Array.isArray(received.attachments)
      ? received.attachments.slice(0, MAX_FORWARDED_ATTACHMENTS)
      : [];

    for (const attachment of attachmentMetadata) {
      try {
        const { data: detail, error: attachmentError } = await resend.emails.receiving.attachments.get({
          id: attachment.id,
          emailId
        });

        if (attachmentError || !detail?.download_url) continue;
        const size = Number(detail.size || 0);
        if (size > 0 && forwardedBytes + size > MAX_FORWARDED_ATTACHMENT_BYTES) continue;

        forwardedAttachments.push({
          filename: detail.filename || attachment.filename || 'attachment',
          path: detail.download_url
        });
        forwardedBytes += size;
      } catch {
        /* Forward the message even if one attachment cannot be retrieved. */
      }
    }

    const safeFrom = escapeHtml(originalFrom);
    const safeSubject = escapeHtml(subject);
    const safeBody = escapeHtml(bodyText).replaceAll('\n', '<br>');
    const attachmentNote = received.attachments?.length
      ? `${forwardedAttachments.length} of ${received.attachments.length} attachment(s) forwarded.`
      : 'No attachments.';

    const { error: sendError } = await resend.emails.send(
      {
        from: 'Mikhail Kirs Contact <contact@mikhailkirs.com>',
        to: [FORWARD_ADDRESS],
        replyTo,
        subject: `[contact@mikhailkirs.com] ${subject}`,
        text: `Email received at ${CONTACT_ADDRESS}\n\nFrom: ${originalFrom}\nSubject: ${subject}\n\n${bodyText}\n\n${attachmentNote}`,
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;color:#20364A;line-height:1.55;max-width:720px;margin:0 auto;padding:24px;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#69418C;">Forwarded from contact@mikhailkirs.com</p>
            <h1 style="margin:0 0 22px;font-size:26px;line-height:1.18;">${safeSubject}</h1>
            <p style="margin:0 0 20px;"><strong>From:</strong> ${safeFrom}</p>
            <div style="padding:20px;border:1px solid #D8E9EE;border-radius:20px 10px 20px 10px;background:#F4EFE6;">${safeBody}</div>
            <p style="margin:20px 0 0;font-size:13px;color:#5F6D78;">${escapeHtml(attachmentNote)} Replying to this forwarded email will reply to the original sender.</p>
          </div>
        `,
        attachments: forwardedAttachments.length ? forwardedAttachments : undefined,
        tags: [
          { name: 'source', value: 'portfolio_inbound' }
        ]
      },
      {
        idempotencyKey: `portfolio-inbound/${emailId}`
      }
    );

    if (sendError) {
      console.error('Unable to forward received email:', sendError);
      return json({ error: 'Unable to forward received email.' }, 502);
    }

    return json({ ok: true });
  }
};

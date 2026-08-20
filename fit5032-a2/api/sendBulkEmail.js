const json = (response, status, body) => response.status(status).json(body)

const verifyFirebaseToken = async (idToken) => {
  const apiKey = process.env.FIREBASE_API_KEY
  if (!apiKey || !idToken) return null
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken })
  })
  if (!response.ok) return null
  const data = await response.json()
  return data.users?.[0] ?? null
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return json(response, 405, { error: 'Method not allowed.' })
  }

  const token = request.headers.authorization?.replace(/^Bearer\s+/i, '')
  const sender = await verifyFirebaseToken(token)
  const allowedAdmins = (process.env.ADMIN_EMAILS ?? '').split(',').map((email) => email.trim().toLocaleLowerCase())
  if (!sender?.email || !allowedAdmins.includes(sender.email.toLocaleLowerCase())) {
    return json(response, 403, { error: 'Administrator authentication is required.' })
  }

  const { recipients, subject, body, attachment } = request.body ?? {}
  if (!Array.isArray(recipients) || recipients.length < 1 || recipients.length > 100 || typeof subject !== 'string' || typeof body !== 'string') {
    return json(response, 400, { error: 'Provide 1 to 100 recipients, a subject and a message.' })
  }
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return json(response, 503, { error: 'Email service is not configured in Vercel.' })
  }

  const payload = {
    from: process.env.RESEND_FROM_EMAIL,
    to: recipients.map((recipient) => recipient.email),
    subject: subject.trim(),
    text: body.trim(),
    attachments: attachment?.content && attachment?.filename
      ? [{ filename: attachment.filename, content: attachment.content }]
      : undefined
  }
  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  if (!resendResponse.ok) {
    const details = await resendResponse.json().catch(() => ({}))
    return json(response, 502, { error: details.message || 'The email provider rejected the request.' })
  }
  return json(response, 202, { accepted: recipients.length })
}

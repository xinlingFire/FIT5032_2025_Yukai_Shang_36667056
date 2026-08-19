const { onCall, HttpsError } = require('firebase-functions/v2/https')
const { defineSecret } = require('firebase-functions/params')
const { Resend } = require('resend')

const resendApiKey = defineSecret('RESEND_API_KEY')

exports.sendBulkEmail = onCall({ secrets: [resendApiKey] }, async (request) => {
  if (!request.auth?.token.admin) throw new HttpsError('permission-denied', 'Administrator access is required.')
  const { recipients, subject, body } = request.data ?? {}
  if (!Array.isArray(recipients) || !recipients.length || recipients.length > 100 || typeof subject !== 'string' || typeof body !== 'string') {
    throw new HttpsError('invalid-argument', 'Provide 1-100 recipients, a subject and a message.')
  }
  const resend = new Resend(resendApiKey.value())
  const results = await Promise.all(recipients.map(({ email, name }) => resend.emails.send({ from: 'Open Shelf Health <noreply@YOUR_VERIFIED_DOMAIN>', to: email, subject, text: `Hello ${name},\n\n${body}` })))
  return { accepted: results.length }
})

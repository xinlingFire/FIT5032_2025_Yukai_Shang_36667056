<script setup>
import { computed, ref } from 'vue'
import { auth } from '../services/firebase'
const props = defineProps({ members: { type: Array, default: () => [] } })
const selectedIds = ref([]); const subject = ref(''); const body = ref(''); const attachment = ref(null); const status = ref(''); const error = ref(''); const submitting = ref(false)
const recipients = computed(() => props.members.filter((member) => selectedIds.value.includes(member.id)))
const attachmentAsBase64 = () => new Promise((resolve, reject) => {
  if (!attachment.value) return resolve(null)
  if (attachment.value.size > 3 * 1024 * 1024) return reject(new Error('Attachments must be 3 MB or smaller.'))
  const reader = new FileReader()
  reader.onload = () => resolve({ filename: attachment.value.name, content: String(reader.result).split(',')[1] })
  reader.onerror = () => reject(new Error('The attachment could not be read.'))
  reader.readAsDataURL(attachment.value)
})
const submit = async () => {
  error.value = ''; status.value = ''
  if (!recipients.value.length || !subject.value.trim() || !body.value.trim()) { error.value = 'Select at least one recipient, then add a subject and message.'; return }
  submitting.value = true
  try {
    const idToken = await auth?.currentUser?.getIdToken()
    if (!idToken) throw new Error('Sign in with the configured Firebase administrator account before sending email.')
    const response = await fetch('/api/sendBulkEmail', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` }, body: JSON.stringify({ recipients: recipients.value.map(({ name, email }) => ({ name, email })), subject: subject.value.trim(), body: body.value.trim(), attachment: await attachmentAsBase64() }) })
    const result = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(result.error || 'The email service did not accept the request.')
    status.value = `Delivery request accepted for ${recipients.value.length} recipients.`
  } catch (reason) { error.value = reason.message } finally { submitting.value = false }
}
</script>
<template><section class="bulk-email" aria-labelledby="bulk-email-heading"><div><p class="eyebrow">Community communication</p><h2 id="bulk-email-heading">Bulk email</h2></div><form @submit.prevent="submit"><fieldset><legend class="form-label">Recipients</legend><label v-for="member in members.filter((member) => member.role === 'student')" :key="member.id" class="recipient-option"><input v-model="selectedIds" type="checkbox" :value="member.id" /> {{ member.name }} <small>{{ member.email }}</small></label></fieldset><label class="form-label" for="email-subject">Subject</label><input id="email-subject" v-model="subject" class="form-control mb-3" maxlength="120" /><label class="form-label" for="email-body">Message</label><textarea id="email-body" v-model="body" class="form-control" rows="4" maxlength="2000"></textarea><label class="form-label mt-3" for="email-attachment">Attachment (optional)</label><input id="email-attachment" class="form-control" type="file" @change="attachment = $event.target.files[0]" /><button class="btn btn-primary mt-3" type="submit" :disabled="submitting">{{ submitting ? 'Sending…' : 'Send email' }}</button></form><p v-if="status" class="status-success" role="status">{{ status }}</p><p v-if="error" class="status-error" role="alert">{{ error }}</p></section></template>

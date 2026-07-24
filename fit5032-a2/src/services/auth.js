import { computed, ref } from 'vue'

const USERS_STORAGE_KEY = 'open-shelf-library-users'
const SESSION_STORAGE_KEY = 'open-shelf-library-session'

const normaliseEmail = (email) => email.trim().toLocaleLowerCase()

const readUsers = () => {
  try {
    const users = JSON.parse(window.localStorage.getItem(USERS_STORAGE_KEY) ?? '[]')
    return Array.isArray(users) ? users : []
  } catch {
    return []
  }
}

const saveUsers = (users) => {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

const toPublicUser = ({ id, name, email, createdAt }) => ({
  id,
  name,
  email,
  createdAt
})

const loadCurrentUser = () => {
  try {
    const session = JSON.parse(window.localStorage.getItem(SESSION_STORAGE_KEY) ?? 'null')

    if (!session?.userId) {
      return null
    }

    const user = readUsers().find((storedUser) => storedUser.id === session.userId)
    return user ? toPublicUser(user) : null
  } catch {
    return null
  }
}

const createUserId = () =>
  window.crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`

const hashPassword = async (password) => {
  const bytes = new TextEncoder().encode(password)
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', bytes)

  return Array.from(new Uint8Array(hashBuffer), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

const currentUser = ref(loadCurrentUser())
const isAuthenticated = computed(() => currentUser.value !== null)

const startSession = (user) => {
  const publicUser = toPublicUser(user)
  currentUser.value = publicUser
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ userId: user.id }))
}

export const register = async ({ name, email, password }) => {
  const users = readUsers()
  const normalisedEmail = normaliseEmail(email)
  const existingUser = users.find((user) => user.email === normalisedEmail)

  if (existingUser) {
    return { success: false, message: 'An account already exists for this email address.' }
  }

  const user = {
    id: createUserId(),
    name: name.trim(),
    email: normalisedEmail,
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString()
  }

  users.push(user)
  saveUsers(users)
  startSession(user)

  return { success: true }
}

export const login = async ({ email, password }) => {
  const user = readUsers().find((storedUser) => storedUser.email === normaliseEmail(email))

  if (!user || user.passwordHash !== (await hashPassword(password))) {
    return { success: false, message: 'The email address or password is incorrect.' }
  }

  startSession(user)
  return { success: true }
}

export const logout = () => {
  currentUser.value = null
  window.localStorage.removeItem(SESSION_STORAGE_KEY)
}

export { currentUser, isAuthenticated }

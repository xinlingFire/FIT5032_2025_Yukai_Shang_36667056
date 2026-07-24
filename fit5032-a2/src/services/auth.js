import { computed, ref } from 'vue'

const USERS_STORAGE_KEY = 'open-shelf-library-users'
const SESSION_STORAGE_KEY = 'open-shelf-library-session'
const ADMIN_EMAIL = 'admin@openshelf.local'
const ADMIN_ACCOUNT = {
  id: 'open-shelf-admin',
  name: 'Open Shelf Admin',
  email: ADMIN_EMAIL,
  passwordHash: 'aa163422e098f8a463b38e5dedbe08d133d48fac0a8693582a48d3db59cd2a06',
  role: 'admin',
  createdAt: '2025-01-01T00:00:00.000Z'
}

const normaliseEmail = (email) => email.trim().toLocaleLowerCase()
const normaliseRole = (role) => (role === 'admin' ? 'admin' : 'student')

const normaliseUser = (user) => ({
  ...user,
  role: normaliseRole(user.role)
})

const readUsers = () => {
  try {
    const users = JSON.parse(window.localStorage.getItem(USERS_STORAGE_KEY) ?? '[]')
    const normalisedUsers = Array.isArray(users) ? users.map(normaliseUser) : []
    const hasAdminAccount = normalisedUsers.some((user) => user.email === ADMIN_EMAIL)

    return hasAdminAccount ? normalisedUsers : [ADMIN_ACCOUNT, ...normalisedUsers]
  } catch {
    return [ADMIN_ACCOUNT]
  }
}

const saveUsers = (users) => {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

const toPublicUser = ({ id, name, email, role, createdAt }) => ({
  id,
  name,
  email,
  role: normaliseRole(role),
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
    role: 'student',
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

export const getRegisteredUsers = () =>
  readUsers()
    .map(toPublicUser)
    .sort((firstUser, secondUser) => firstUser.name.localeCompare(secondUser.name))

export { currentUser, isAuthenticated }

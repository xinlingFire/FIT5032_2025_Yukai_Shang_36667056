import { computed, ref } from 'vue'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, firebaseEnabled } from './firebase'

const USERS_STORAGE_KEY = 'open-shelf-library-users'
const SESSION_STORAGE_KEY = 'open-shelf-library-session'
const ADMIN_EMAIL = 'admin@openshelf.local'
const ADMIN_ACCOUNT = {
  id: 'open-shelf-admin',
  name: 'Open Shelf Health Coordinator',
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

const cacheRegisteredUser = (user) => {
  const users = readUsers().filter((storedUser) => storedUser.id !== user.id)
  saveUsers([...users, user])
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

const firebasePublicUser = async (user) => {
  if (!user) return null
  const token = await user.getIdTokenResult()
  let profile = null
  if (db) {
    const snapshot = await getDoc(doc(db, 'profiles', user.uid))
    profile = snapshot.exists() ? snapshot.data() : null
  }
  return {
    id: user.uid,
    name: profile?.name || user.displayName || user.email?.split('@')[0] || 'Community member',
    email: user.email || '',
    role: token.claims.admin === true || profile?.role === 'admin' ? 'admin' : 'student',
    createdAt: profile?.createdAt?.toDate?.()?.toISOString?.() || user.metadata.creationTime || new Date().toISOString()
  }
}

if (firebaseEnabled && auth) {
  onAuthStateChanged(auth, async (user) => {
    try {
      const publicUser = await firebasePublicUser(user)
      currentUser.value = publicUser
      if (publicUser) window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ userId: publicUser.id }))
      else window.localStorage.removeItem(SESSION_STORAGE_KEY)
    } catch {
      // Keep the local demonstration session if Firebase is unavailable.
    }
  })
}

const startSession = (user) => {
  const publicUser = toPublicUser(user)
  currentUser.value = publicUser
  window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ userId: user.id }))
}

export const register = async ({ name, email, password }) => {
  if (firebaseEnabled && auth) {
    try {
      const credential = await createUserWithEmailAndPassword(auth, normaliseEmail(email), password)
      await updateProfile(credential.user, { displayName: name.trim() })
      if (db) await setDoc(doc(db, 'profiles', credential.user.uid), { name: name.trim(), email: normaliseEmail(email), role: 'student', createdAt: serverTimestamp() })
      currentUser.value = await firebasePublicUser(credential.user)
      cacheRegisteredUser(currentUser.value)
      return { success: true }
    } catch (error) {
      if (error.code !== 'auth/configuration-not-found' && error.code !== 'auth/operation-not-allowed') {
        return { success: false, message: error.code === 'auth/email-already-in-use' ? 'An account already exists for this email address.' : 'Firebase could not create the account. Check that Email/Password sign-in is enabled.' }
      }
    }
  }
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
  if (firebaseEnabled && auth) {
    try {
      const credential = await signInWithEmailAndPassword(auth, normaliseEmail(email), password)
      currentUser.value = await firebasePublicUser(credential.user)
      return { success: true }
    } catch (error) {
      if (error.code !== 'auth/configuration-not-found' && error.code !== 'auth/operation-not-allowed' && error.code !== 'auth/user-not-found') {
        return { success: false, message: 'The email address or password is incorrect.' }
      }
    }
  }
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
  if (firebaseEnabled && auth) signOut(auth).catch(() => {})
}

export const getRegisteredUsers = () =>
  readUsers()
    .map(toPublicUser)
    .sort((firstUser, secondUser) => firstUser.name.localeCompare(secondUser.name))

export { currentUser, isAuthenticated }

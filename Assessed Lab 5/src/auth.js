import { ref } from 'vue'

const VALID_USERNAME = 'admin'
const VALID_PASSWORD = 'Password123!'

// Use sessionStorage so login remains after refreshing the page.
export const isAuthenticated = ref(
  sessionStorage.getItem('isAuthenticated') === 'true'
)

export const currentUser = ref(
  sessionStorage.getItem('currentUser') || ''
)

export const login = (username, password) => {
  const credentialsAreValid =
    username === VALID_USERNAME &&
    password === VALID_PASSWORD

  if (credentialsAreValid) {
    isAuthenticated.value = true
    currentUser.value = username

    sessionStorage.setItem('isAuthenticated', 'true')
    sessionStorage.setItem('currentUser', username)

    return true
  }

  isAuthenticated.value = false
  currentUser.value = ''

  sessionStorage.removeItem('isAuthenticated')
  sessionStorage.removeItem('currentUser')

  return false
}

export const logout = () => {
  isAuthenticated.value = false
  currentUser.value = ''

  sessionStorage.removeItem('isAuthenticated')
  sessionStorage.removeItem('currentUser')
}

import { ref } from 'vue'
import { login as loginRequest } from '../services/auth.api'
import type { AuthResponse, LoginRequest } from '../types/auth'

const STORAGE_KEY = 'auth_session'

type Session = AuthResponse

function readSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Session
  } catch {
    return null
  }
}

const session = ref<Session | null>(readSession())
const isAuthenticated = ref(session.value !== null)

export function useAuth() {
  const login = async (credentials: LoginRequest) => {
    const result = await loginRequest(credentials)
    session.value = result
    isAuthenticated.value = true
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
  }

  const logout = () => {
    session.value = null
    isAuthenticated.value = false
    localStorage.removeItem(STORAGE_KEY)
  }

  return { isAuthenticated, session, login, logout }
}
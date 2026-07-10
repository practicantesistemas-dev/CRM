import { ref } from 'vue'
import { decodeJwt } from 'jose'
import { login as loginRequest, getMe } from '../services/auth.api'
import type { AuthResponse, LoginRequest, MeResponse } from '../types/auth'

const STORAGE_KEY = 'auth_session'

type Session = AuthResponse

function isTokenExpired(token: string): boolean {
  try {
    const { exp } = decodeJwt(token)
    if (!exp) return false
    return Date.now() >= exp * 1000
  } catch {
    return true
  }
}

function readSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Session
    if (isTokenExpired(parsed.token)) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function toMe(s: Session): MeResponse {
  const { token: _token, ...rest } = s
  return rest
}

const session = ref<Session | null>(readSession())
const isAuthenticated = ref(session.value !== null)
const me = ref<MeResponse | null>(session.value ? toMe(session.value) : null)

export function useAuth() {
  const login = async (credentials: LoginRequest) => {
    const result = await loginRequest(credentials)
    session.value = result
    isAuthenticated.value = true
    me.value = toMe(result)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
  }

  const logout = () => {
    session.value = null
    isAuthenticated.value = false
    me.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  // Verifica el token vigente y cierra la sesión si ya expiró. Úsalo antes de
  // decidir si una ruta protegida puede renderizarse.
  const checkSession = (): boolean => {
    if (session.value && isTokenExpired(session.value.token)) {
      logout()
    }
    return isAuthenticated.value
  }

  // Refresca nombres/rol contra /api/auth/me. Si falla, conserva los datos
  // que ya vinieron del login en vez de romper la UI.
  const fetchMe = async () => {
    if (!session.value) return
    try {
      me.value = await getMe(session.value.token)
    } catch {
      // se mantiene el último valor conocido
    }
  }

  return { isAuthenticated, session, me, login, logout, checkSession, fetchMe }
}
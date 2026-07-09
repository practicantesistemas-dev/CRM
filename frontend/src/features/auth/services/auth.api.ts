import type { AuthResponse, LoginRequest } from '../types/auth'

const API_URL = import.meta.env.VITE_PORTAL_PRINCIPAL_URL

export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const detail = typeof body?.detail === 'string' ? body.detail : null
    throw new Error(detail ?? 'Credenciales inválidas o cuenta no activa en consola.')
  }

  return response.json()
}
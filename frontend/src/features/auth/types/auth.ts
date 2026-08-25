export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  username: string
  nombres: string
  portal_role: string
  id_area: number | null
  area_name: string
  email: string
  /** Permisos granulares del CRM como "modulo:accion" (ej. "contactos:ver"). */
  permisos: string[]
  /** NOMBRE del rol en INTRANET_ROLES_APP para CRM_MERCADEO (ej. "Admin"). */
  role_crm: string | null
}

export type MeResponse = Omit<AuthResponse, 'token'>
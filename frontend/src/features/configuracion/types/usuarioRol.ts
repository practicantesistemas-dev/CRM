export interface UsuarioBusqueda {
  id: number
  usuario: string
  nombres: string
  estado: string | null
  roleCrmId: number | null
  roleCrm: string | null
}

export interface RolAsignable {
  id: number
  nombre: string
}

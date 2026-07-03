export interface Proveedor {
  id: number
  nombre: string
  categoria: string
  nit: string
  correo: string
  telefono: string
  estado: 'Activo' | 'Inactivo'
}

export type ProveedorDraft = Omit<Proveedor, 'id'>

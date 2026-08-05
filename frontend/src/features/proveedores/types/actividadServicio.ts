export interface ActividadServicio {
  id: number
  proveedorId: number
  nombre: string
  cantidad: number
  precio: number
  descripcion: string
}

export type ActividadServicioDraft = Omit<ActividadServicio, 'id'>

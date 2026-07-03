import type { Proveedor, ProveedorDraft } from '../types/proveedor'

export const PROVEEDORES_MOCK: Proveedor[] = [
  { id: 1, nombre: 'MediSupply S.A.S', categoria: 'Insumos Médicos', nit: '900.111.222-3', correo: 'ventas@medisupply.com', telefono: '604-555-1234', estado: 'Activo' },
  { id: 2, nombre: 'PrintMax Colombia', categoria: 'Material POP', nit: '800.333.444-5', correo: 'info@printmax.co', telefono: '601-777-8888', estado: 'Activo' },
  { id: 3, nombre: 'Tech Rental Andina', categoria: 'Equipos Tecnológicos', nit: '830.555.666-7', correo: 'alquileres@techrent.co', telefono: '310-222-3333', estado: 'Inactivo' },
  { id: 4, nombre: 'Catering Eventos Plus', categoria: 'Alimentación', nit: '900.777.888-1', correo: 'eventos@cateringplus.co', telefono: '315-444-5555', estado: 'Activo' },
  { id: 5, nombre: 'Logística Eje Cafetero', categoria: 'Transporte', nit: '811.999.000-6', correo: 'ops@logisticaeje.co', telefono: '316-888-9900', estado: 'Activo' },
]

export const PROVEEDOR_DRAFT_VACIO: ProveedorDraft = {
  nombre: '', categoria: '', nit: '', correo: '', telefono: '', estado: 'Activo',
}

export const categoriaColor = (cat: string) => {
  const map: Record<string, string> = {
    'Insumos Médicos':     'text-[#065F46]',
    'Material POP':        'text-[#1E3A8A]',
    'Equipos Tecnológicos':'text-[#1A2A6C]',
    'Alimentación':        'text-[#92400E]',
    'Transporte':          'text-[#9D174D]',
  }
  return map[cat] ?? 'text-slate-500'
}

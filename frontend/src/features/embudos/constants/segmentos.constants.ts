import type { FiltroSegmento } from './ciclo-afiliado.constants'

export interface Segmento {
  id: string
  nombre: string
  descripcion: string
  personas: number
  conCorreo: number
  conCelular: number
  criterios: string[]
  actualizado: string
  // Criterios estructurados: al abrir el segmento se precargan en el segmentador.
  filtros: Partial<FiltroSegmento>
}

// Datos mock.
export const SEGMENTOS_MOCK: Segmento[] = [
  {
    id: 'sin-uso-90',
    nombre: 'Plan activo sin uso (90 días)',
    descripcion: 'Afiliados vigentes que no han usado ningún servicio en los últimos 90 días.',
    personas: 412, conCorreo: 288, conCelular: 361,
    criterios: ['Plan Liga', 'Último uso: +90 días'],
    actualizado: 'hoy',
    filtros: { planLiga: 'Plan Liga', ultimoUso: '90' },
  },
  {
    id: 'mujeres-40-mamo',
    nombre: 'Mujeres 40+ sin mamografía',
    descripcion: 'Afiliadas mujeres mayores de 40 años sin mamografía en los últimos 12 meses.',
    personas: 1180, conCorreo: 740, conCelular: 980,
    criterios: ['Sexo: Mujeres', 'Edad: 40+', 'No usó: Mamografía'],
    actualizado: 'hace 2 días',
    filtros: { sexo: 'F', edadMin: '40', servicios: ['Mamografía bilateral'] },
  },
  {
    id: 'proximos-vencer',
    nombre: 'Próximos a vencer sin gestión',
    descripcion: 'Titulares en etapa "Por renovar" que aún no tienen gestión de renovación.',
    personas: 96, conCorreo: 71, conCelular: 88,
    criterios: ['Etapa: Por renovar'],
    actualizado: 'hoy',
    filtros: { etapas: ['Por renovar'] },
  },
  {
    id: 'convenios-bajo-uso',
    nombre: 'Convenios empresariales con bajo uso',
    descripcion: 'Afiliados con vinculación por empresa.',
    personas: 540, conCorreo: 210, conCelular: 505,
    criterios: ['Vinculación: Empresa'],
    actualizado: 'hace 5 días',
    filtros: { vinculacion: 'Empresa' },
  },
  {
    id: 'prospectos-feria',
    nombre: 'Prospectos de feria de salud',
    descripcion: 'Contactos captados en ferias de salud que aún no se han afiliado.',
    personas: 234, conCorreo: 150, conCelular: 220,
    criterios: ['Origen: Feria de salud', 'Etapa: Prospecto'],
    actualizado: 'hace 1 semana',
    filtros: { origen: 'Feria de salud', etapas: ['Prospecto'] },
  },
  {
    id: 'nuevos-sin-uso',
    nombre: 'Nuevos afiliados sin primer uso',
    descripcion: 'Afiliados con menos de 90 días que aún no han usado ningún servicio.',
    personas: 128, conCorreo: 96, conCelular: 118,
    criterios: ['Antigüedad: ≤ 90 días', 'Último uso: Nunca'],
    actualizado: 'hoy',
    filtros: { antiguedad: '90', ultimoUso: 'nunca' },
  },
]

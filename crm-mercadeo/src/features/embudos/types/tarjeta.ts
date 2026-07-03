export interface Tarjeta {
  id: number
  empresa: string
  contacto: string
  valor: string
  responsable: string
  seguimiento: string
  etapa: string
}

export type TarjetaDraft = Omit<Tarjeta, 'id'>

export interface EtapaColor {
  bg: string
  border: string
  text: string
  dot: string
}

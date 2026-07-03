export interface FiltrosSegmento {
  empresa: string
  servicio: string
  estado: string
  etiqueta: string
  ciudad: string
  responsable: string
}

export interface Segmento extends FiltrosSegmento {
  id: number
  nombre: string
  total: number
  creadoEn: string
}

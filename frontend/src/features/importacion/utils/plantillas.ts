import type { TipoImportacion } from '../types/importacion'

// Las plantillas viven como archivos estáticos en frontend/public/plantillas/, en una sola hoja
// "Datos" (mismo formato que Plantilla_Carga_PlanLiga.xlsx): título + instrucciones en las
// primeras filas, encabezados coloreados (con el detalle de cada columna en un comentario al
// pasar el cursor) y una fila de ejemplo debajo. leerHoja.ts busca la fila de encabezados de
// forma dinámica (no asume que sea la fila 1) y descarta la fila de ejemplo si no se modificó.
// Si se edita el contenido de alguna plantilla, HEADERS_*/FILA_EJEMPLO_* de abajo deben quedar
// en el mismo orden/valores que la hoja "Datos" del .xlsx correspondiente.
const NOMBRES_PLANTILLA: Record<TipoImportacion, string> = {
  contactos: 'Plantilla_Contactos.xlsx',
  empresas: 'Plantilla_Empresas.xlsx',
  proveedores: 'Plantilla_Proveedores.xlsx',
}

export function descargarPlantilla(tipo: TipoImportacion): void {
  const nombre = NOMBRES_PLANTILLA[tipo]
  const enlace = document.createElement('a')
  enlace.href = `/plantillas/${nombre}`
  enlace.download = nombre
  enlace.click()
}

export const HEADERS_CONTACTOS = [
  'PRIMER_NOMBRE', 'SEGUNDO_NOMBRE', 'PRIMER_APELLIDO', 'SEGUNDO_APELLIDO', 'TIPO_DOCUMENTO', 'DOCUMENTO',
  'CORREO', 'TELEFONO', 'CARGO', 'EMPRESA', 'DEPARTAMENTO', 'CIUDAD', 'FECHA_NACIMIENTO', 'SEXO',
  'TIPO_CONTACTO', 'ETIQUETAS',
]
export const FILA_EJEMPLO_CONTACTOS: Record<string, string> = {
  PRIMER_NOMBRE: 'JUAN', SEGUNDO_NOMBRE: 'CARLOS', PRIMER_APELLIDO: 'GOMEZ', SEGUNDO_APELLIDO: 'RESTREPO',
  TIPO_DOCUMENTO: 'CC', DOCUMENTO: '1088123456', CORREO: 'juan.gomez@correo.com', TELEFONO: '3101234567',
  CARGO: 'Gerente', EMPRESA: 'COMERCIALIZADORA XYZ SAS', DEPARTAMENTO: 'RISARALDA', CIUDAD: 'PEREIRA',
  FECHA_NACIMIENTO: '14/05/1990', SEXO: 'M', TIPO_CONTACTO: 'Prospecto', ETIQUETAS: 'VIP, Interesado',
}

export const HEADERS_EMPRESAS = ['RAZON_SOCIAL', 'NIT', 'INDUSTRIA', 'DIRECCION', 'CIUDAD', 'ESTADO']
export const FILA_EJEMPLO_EMPRESAS: Record<string, string> = {
  RAZON_SOCIAL: 'COMERCIALIZADORA XYZ SAS', NIT: '900123456-7', INDUSTRIA: 'Comercio',
  DIRECCION: 'CR 15 # 20-40', CIUDAD: 'Pereira', ESTADO: 'Activa',
}

export const HEADERS_PROVEEDORES = ['NOMBRE', 'CATEGORIA', 'NIT', 'CORREO', 'TELEFONO', 'ESTADO']
export const FILA_EJEMPLO_PROVEEDORES: Record<string, string> = {
  NOMBRE: 'Distribuidora ABC', CATEGORIA: 'Insumos médicos', NIT: '900987654-3',
  CORREO: 'contacto@abc.com', TELEFONO: '3201234567', ESTADO: 'Activo',
}

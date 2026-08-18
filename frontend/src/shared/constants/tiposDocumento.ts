// Catálogo oficial de tipo de identificación (compartido entre Contactos y Plan Liga: Titulares,
// Beneficiarios, Reemplazos). No agregar códigos que no estén en esta lista ni inventar
// descripciones para los que no se conocen con certeza (se muestran con el código solo).
export const TIPOS_DOCUMENTO = [
  'AS', 'ASI', 'CC', 'CD', 'CE', 'CN', 'DE', 'MS', 'MSI', 'NIT', 'NU', 'PA', 'PE', 'PT', 'RC', 'SC', 'SI', 'TI',
] as const

export type TipoDocumento = (typeof TIPOS_DOCUMENTO)[number]

const ETIQUETAS_CONOCIDAS: Partial<Record<TipoDocumento, string>> = {
  CC: 'Cédula de Ciudadanía',
  CE: 'Cédula de Extranjería',
  TI: 'Tarjeta de Identidad',
  RC: 'Registro Civil',
  PA: 'Pasaporte',
  NIT: 'NIT',
}

export interface OpcionTipoDocumento {
  value: TipoDocumento
  label: string
}

export const TIPOS_DOCUMENTO_OPCIONES: OpcionTipoDocumento[] = TIPOS_DOCUMENTO.map((codigo) => ({
  value: codigo,
  label: ETIQUETAS_CONOCIDAS[codigo] ? `${ETIQUETAS_CONOCIDAS[codigo]} (${codigo})` : codigo,
}))

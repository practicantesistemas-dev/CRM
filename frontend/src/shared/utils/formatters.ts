/** Formatea un teléfono colombiano de 10 dígitos como "300-000-0000". Si no calza, deja el valor recortado tal cual. */
export function formatTelefonoCO(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  return value.trim()
}

/** Formatea un valor monetario como "$1.234.567" a partir de los dígitos presentes en el texto. */
export function formatMoneyCOP(value: string): string {
  const digits = value.replace(/[^0-9]/g, '')
  if (!digits) return '$0'
  return '$' + Number(digits).toLocaleString('es-CO')
}

/** Formatea un NIT/documento dejando solo dígitos y guiones, recortado. */
export function formatNit(value: string): string {
  return value.trim().replace(/[^0-9-]/g, '')
}

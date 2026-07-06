/**
 * Clase de borde según el estado del campo: rojo si es inválido, verde si ya se envió el
 * formulario al menos una vez y quedó válido, o el estilo neutro de siempre en otro caso.
 */
export function fieldStateClass(hasError: boolean, isValid: boolean, neutralClass: string): string {
  if (hasError) return 'border-red-300 focus:border-red-400'
  if (isValid) return 'border-emerald-400 focus:border-emerald-500'
  return neutralClass
}

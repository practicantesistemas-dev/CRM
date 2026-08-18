import { z } from 'zod'
import { formatTelefonoCO } from './formatters'
import { TIPOS_DOCUMENTO } from '@/shared/constants/tiposDocumento'

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÑÜáéíóúñü]+$/
const capitalizar = (palabra: string) => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase()

/** Correo opcional: permite cadena vacía, pero valida formato si viene diligenciado. */
export const optionalEmail = (message = 'Correo electrónico inválido') =>
  z.union([z.literal(''), z.string().trim().toLowerCase().email(message)])

/**
 * Nombre de persona: "nombre1 [nombre2] apellido1 [apellido2]".
 * Exige al menos un nombre y un apellido (2 a 6 palabras: cubre casos con 3 nombres o 3
 * apellidos, que en el formulario se escriben dos palabras juntas en el campo "segundo
 * nombre" o "segundo apellido"), solo letras, y capitaliza cada palabra.
 */
export const nombrePersona = (opts: { opcional?: boolean; message?: string } = {}) => {
  const mensaje = opts.message ??
    'Escribe nombre(s) y apellido(s) separados por espacio: mínimo un nombre y un apellido, solo letras (máx. 6 palabras)'
  return z.string()
    .trim()
    .transform((v) => v.replace(/\s+/g, ' '))
    .refine((v) => {
      if (opts.opcional && v === '') return true
      const palabras = v.split(' ').filter(Boolean)
      return palabras.length >= 2 && palabras.length <= 6 && palabras.every((p) => SOLO_LETRAS.test(p))
    }, mensaje)
    .transform((v) => (v === '' ? v : v.split(' ').map(capitalizar).join(' ')))
}

/** Tipo de documento: uno de los códigos oficiales (ver shared/constants/tiposDocumento.ts). */
export const tipoDocumento = (opts: { opcional?: boolean; message?: string } = {}) => {
  const mensaje = opts.message ?? `Tipo de documento inválido (use uno de: ${TIPOS_DOCUMENTO.join(', ')})`
  return z.string()
    .trim()
    .toUpperCase()
    .refine((v) => (opts.opcional && v === '') || (TIPOS_DOCUMENTO as readonly string[]).includes(v), mensaje)
}

/** Documento de identidad: solo dígitos, entre 3 y 15 caracteres. */
export const documentoIdentidad = (opts: { opcional?: boolean; message?: string } = {}) => {
  const mensaje = opts.message ?? 'El documento solo debe contener números (mínimo 3 dígitos)'
  return z.string()
    .trim()
    .refine((v) => (opts.opcional && v === '') || /^\d{3,15}$/.test(v), mensaje)
}

/**
 * Nombre de entidad (empresa, servicio, campaña, automatización): letras, números y puntuación
 * habitual (. , & -), mínimo 3 caracteres y al menos una letra (evita nombres solo numéricos o de símbolos).
 */
export const nombreEntidad = (opts: { opcional?: boolean; message?: string } = {}) => {
  const mensaje = opts.message ?? 'Ingresa un nombre válido (mín. 3 caracteres, no solo números o símbolos)'
  return z.string()
    .trim()
    .transform((v) => v.replace(/\s+/g, ' '))
    .refine((v) => {
      if (opts.opcional && v === '') return true
      return v.length >= 3
        && /[A-Za-zÁÉÍÓÚÑÜáéíóúñü]/.test(v)
        && /^[A-Za-z0-9ÁÉÍÓÚÑÜáéíóúñü.,&·\-\s]+$/.test(v)
    }, mensaje)
}

/** Código interno (ej. "PLE-001"): letras, números y guiones, 3 a 20 caracteres, en mayúsculas. */
export const codigoEntidad = (message = 'El código solo debe contener letras, números y guiones (mín. 3 caracteres)') =>
  z.string()
    .trim()
    .toUpperCase()
    .refine((v) => /^[A-Z0-9-]{3,20}$/.test(v), message)

/** NIT colombiano: dígitos (se aceptan puntos como separador) con dígito de verificación opcional tras un guion. */
export const nit = (opts: { opcional?: boolean; message?: string } = {}) => {
  const mensaje = opts.message ?? 'NIT inválido: solo números, con guion y dígito de verificación opcional (ej: 900123456-7)'
  return z.string()
    .trim()
    .transform((v) => v.replace(/\./g, ''))
    .refine((v) => (opts.opcional && v === '') || /^\d{5,15}(-\d)?$/.test(v), mensaje)
}

/** Teléfono colombiano: si se diligencia, debe resolver a 10 dígitos; se formatea como "300-000-0000". */
export const telefonoCO = (message = 'El teléfono debe tener 10 dígitos') =>
  z.string()
    .trim()
    .refine((v) => v === '' || v.replace(/\D/g, '').length === 10, message)
    .transform(formatTelefonoCO)

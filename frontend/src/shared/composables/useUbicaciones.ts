import { ref } from 'vue'
import { getDepartamentos, getMunicipios } from '../services/ubicaciones.api'
import type { Departamento, Municipio } from '../types/ubicaciones'

const departamentos = ref<Departamento[]>([])
const municipios = ref<Municipio[]>([])
const cargando = ref(false)
let promesaCarga: Promise<void> | null = null

function cargarUbicaciones(): Promise<void> {
  if (promesaCarga) return promesaCarga
  cargando.value = true
  promesaCarga = Promise.all([getDepartamentos(), getMunicipios()])
    .then(([d, m]) => { departamentos.value = d; municipios.value = m })
    .catch((e) => { promesaCarga = null; throw e })
    .finally(() => { cargando.value = false })
  return promesaCarga
}

/**
 * Catálogo de departamentos/municipios de Colombia (/api/compartidos/ubicaciones), cacheado en
 * memoria a nivel de módulo: se pide una sola vez por sesión de la app sin importar cuántos
 * formularios (titular, beneficiario, etc.) lo usen.
 */
export function useUbicaciones() {
  cargarUbicaciones()

  const municipiosDeDepartamento = (codigoDepartamento: string): Municipio[] =>
    municipios.value.filter(m => m.departamentoCodigo === codigoDepartamento)

  return { departamentos, municipios, cargandoUbicaciones: cargando, municipiosDeDepartamento }
}

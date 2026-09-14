import { ref } from 'vue'
import { SEGMENTOS_MOCK, type Segmento } from '../constants/segmentos.constants'
import type { FiltroSegmento } from '../constants/ciclo-afiliado.constants'

// Segmentos guardados: los de ejemplo + los que cree el usuario. Persisten solo
// en el navegador (localStorage), sin backend por ahora.
const KEY = 'crm-embudos-segmentos'

function cargar(): Segmento[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Segmento[]
  } catch { /* noop */ }
  return SEGMENTOS_MOCK.map(s => ({ ...s }))
}

const lista = ref<Segmento[]>(cargar())
const persistir = () => { try { localStorage.setItem(KEY, JSON.stringify(lista.value)) } catch { /* noop */ } }

export function useSegmentosGuardados() {
  const guardar = (datos: {
    nombre: string
    filtros: FiltroSegmento
    criterios: string[]
    personas: number
    conCorreo: number
    conCelular: number
  }) => {
    lista.value.unshift({
      id: 'seg-' + Date.now(),
      nombre: datos.nombre.trim(),
      descripcion: 'Segmento guardado desde "Audiencias".',
      personas: datos.personas,
      conCorreo: datos.conCorreo,
      conCelular: datos.conCelular,
      criterios: datos.criterios.length ? datos.criterios : ['Sin filtros'],
      actualizado: 'hoy',
      filtros: datos.filtros,
    })
    persistir()
  }

  const eliminar = (id: string) => {
    lista.value = lista.value.filter(s => s.id !== id)
    persistir()
  }

  return { segmentos: lista, guardar, eliminar }
}

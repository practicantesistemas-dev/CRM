import { ref, reactive, computed } from 'vue'
import type { Segmento } from '../types/segmento'
import { FILTROS_VACIOS } from '../constants/segmentacion.constants'
import { getSegmentos, createSegmento, duplicateSegmento, deleteSegmento } from '../services/segmentacion.api'

export function useSegmentacion() {
  const segmentosGuardados = ref<Segmento[]>(getSegmentos())

  const filtros = reactive({ ...FILTROS_VACIOS })

  const filtrosActivos = computed(() =>
    [filtros.empresa, filtros.servicio !== 'todos', filtros.estado !== 'todos', filtros.etiqueta !== 'todos', filtros.ciudad !== 'todas', filtros.responsable !== 'todos'].filter(Boolean).length
  )

  const resultadoMock = computed(() => {
    let base = 1248
    if (filtros.empresa) base = Math.floor(base * 0.3)
    if (filtros.servicio !== 'todos') base = Math.floor(base * 0.6)
    if (filtros.estado !== 'todos') base = Math.floor(base * 0.5)
    if (filtros.etiqueta !== 'todos') base = Math.floor(base * 0.4)
    if (filtros.ciudad !== 'todas') base = Math.floor(base * 0.3)
    if (filtros.responsable !== 'todos') base = Math.floor(base * 0.4)
    return Math.max(base, 1)
  })

  const limpiar = () => {
    Object.assign(filtros, FILTROS_VACIOS)
  }

  const guardarSegmento = (nombre: string) => {
    segmentosGuardados.value = [createSegmento(nombre, { ...filtros }, resultadoMock.value), ...segmentosGuardados.value]
  }

  const duplicar = (s: Segmento) => {
    segmentosGuardados.value = [duplicateSegmento(s), ...segmentosGuardados.value]
  }

  const eliminar = (id: number) => {
    deleteSegmento(id)
    segmentosGuardados.value = segmentosGuardados.value.filter(s => s.id !== id)
  }

  const cargarSegmento = (s: Segmento) => {
    Object.assign(filtros, { empresa: s.empresa === 'todas' ? '' : s.empresa, servicio: s.servicio, estado: s.estado, etiqueta: s.etiqueta, ciudad: s.ciudad, responsable: s.responsable })
  }

  return {
    segmentosGuardados, filtros, filtrosActivos, resultadoMock,
    limpiar, guardarSegmento, duplicar, eliminar, cargarSegmento,
  }
}

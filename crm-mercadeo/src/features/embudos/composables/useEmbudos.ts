import { ref, computed } from 'vue'
import type { Tarjeta, TarjetaDraft } from '../types/tarjeta'
import { getTarjetas, createTarjeta, moverTarjeta } from '../services/embudos.api'

export function useEmbudos() {
  const tarjetas = ref<Tarjeta[]>(getTarjetas())

  const draggingId = ref<number | null>(null)
  const dropTarget = ref('')

  const onDragStart = (e: DragEvent, id: number) => {
    draggingId.value = id
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move'
      e.dataTransfer.setData('text/plain', String(id))
    }
  }

  const onDragEnd = () => {
    draggingId.value = null
    dropTarget.value = ''
  }

  const onDragOver = (e: DragEvent, etapa: string) => {
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    dropTarget.value = etapa
  }

  const onDragLeave = (e: DragEvent) => {
    const el = e.currentTarget as HTMLElement
    if (!el.contains(e.relatedTarget as Node)) dropTarget.value = ''
  }

  const onDrop = (e: DragEvent, etapa: string) => {
    e.preventDefault()
    if (draggingId.value !== null) {
      const actualizada = moverTarjeta(draggingId.value, etapa)
      if (actualizada) {
        const idx = tarjetas.value.findIndex(t => t.id === actualizada.id)
        if (idx !== -1) tarjetas.value[idx] = actualizada
      }
    }
    draggingId.value = null
    dropTarget.value = ''
  }

  const porEtapa = (etapa: string) => tarjetas.value.filter(t => t.etapa === etapa)

  const valorEtapa = (etapa: string) => {
    const total = porEtapa(etapa).reduce((acc, t) => acc + parseFloat(t.valor.replace(/[^0-9]/g, '')), 0)
    return total > 0 ? '$' + total.toLocaleString('es-CO') : '$0'
  }

  const totalOportunidades = computed(() => tarjetas.value.length)
  const totalValor = computed(() => {
    const t = tarjetas.value.reduce((acc, c) => acc + parseFloat(c.valor.replace(/[^0-9]/g, '')), 0)
    return '$' + t.toLocaleString('es-CO')
  })

  const crearTarjeta = (data: TarjetaDraft) => {
    tarjetas.value = [...tarjetas.value, createTarjeta(data)]
  }

  return {
    tarjetas, draggingId, dropTarget,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    porEtapa, valorEtapa, totalOportunidades, totalValor,
    crearTarjeta,
  }
}

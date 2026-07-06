import { ref, computed } from 'vue'
import type { Tarjeta, TarjetaDraft } from '../types/tarjeta'
import { getTarjetas, createTarjeta, moverTarjeta } from '../services/embudos.api'

export function useEmbudos() {
  const tarjetas = ref<Tarjeta[]>(getTarjetas())

  const draggingId = ref<number | null>(null)
  const dropTarget = ref('')
  const dropIndicator = ref<{ id: number; position: 'before' | 'after' } | null>(null)

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
    dropIndicator.value = null
  }

  const onDragOver = (e: DragEvent, etapa: string) => {
    e.preventDefault()
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'move'
    dropTarget.value = etapa
    // si el puntero no está sobre una tarjeta, se suelta al final de la columna
    if (!(e.target as HTMLElement).closest('[data-kanban-card]')) {
      dropIndicator.value = null
    }
  }

  const onDragOverCard = (id: number, position: 'before' | 'after') => {
    if (id === draggingId.value) return
    dropIndicator.value = { id, position }
  }

  const onDragLeave = (e: DragEvent) => {
    const el = e.currentTarget as HTMLElement
    if (!el.contains(e.relatedTarget as Node)) {
      dropTarget.value = ''
      dropIndicator.value = null
    }
  }

  const onDrop = (e: DragEvent, etapa: string) => {
    e.preventDefault()
    if (draggingId.value !== null) {
      const indicator = dropIndicator.value
      const targetId = indicator && indicator.id !== draggingId.value ? indicator.id : null
      const position = targetId !== null ? indicator!.position : null
      tarjetas.value = moverTarjeta(draggingId.value, etapa, targetId, position)
    }
    draggingId.value = null
    dropTarget.value = ''
    dropIndicator.value = null
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
    tarjetas, draggingId, dropTarget, dropIndicator,
    onDragStart, onDragEnd, onDragOver, onDragOverCard, onDragLeave, onDrop,
    porEtapa, valorEtapa, totalOportunidades, totalValor,
    crearTarjeta,
  }
}

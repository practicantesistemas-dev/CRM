import { ref, computed, type Ref } from 'vue'
import type { EtapaOportunidad, Oportunidad } from '@/features/oportunidades/types/oportunidad'

/**
 * Mecánica de drag-and-drop del Tablero (Kanban): opera sobre la misma lista reactiva de
 * `Oportunidad` que expone useOportunidades (no mantiene su propia copia de datos, a
 * diferencia del useEmbudos original que trabajaba sobre un mock local de "tarjetas").
 * `onCambiarEtapa` la llama solo cuando el drop realmente cambia de columna, para persistir
 * el cambio contra el backend real.
 */
export function useEmbudos(
  oportunidades: Ref<Oportunidad[]>,
  onCambiarEtapa: (id: number, etapa: EtapaOportunidad) => void,
) {
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

  const onDrop = (e: DragEvent, etapa: EtapaOportunidad) => {
    e.preventDefault()
    const id = draggingId.value
    if (id !== null) {
      const idx = oportunidades.value.findIndex(o => o.id === id)
      if (idx !== -1) {
        const anterior = oportunidades.value[idx].estado
        const indicator = dropIndicator.value
        const targetId = indicator && indicator.id !== id ? indicator.id : null
        const position = targetId !== null ? indicator!.position : null

        const actualizada: Oportunidad = { ...oportunidades.value[idx], estado: etapa }
        const resto = [...oportunidades.value.slice(0, idx), ...oportunidades.value.slice(idx + 1)]
        let insertAt = resto.length
        if (targetId !== null) {
          const targetIdx = resto.findIndex(o => o.id === targetId)
          if (targetIdx !== -1) insertAt = position === 'after' ? targetIdx + 1 : targetIdx
        }
        oportunidades.value = [...resto.slice(0, insertAt), actualizada, ...resto.slice(insertAt)]

        if (anterior !== etapa) onCambiarEtapa(id, etapa)
      }
    }
    draggingId.value = null
    dropTarget.value = ''
    dropIndicator.value = null
  }

  const porEtapa = (etapa: string) => oportunidades.value.filter(o => o.estado === etapa)

  const valorEtapa = (etapa: string) => {
    const total = porEtapa(etapa).reduce((acc, o) => acc + parseFloat(o.valor.replace(/[^0-9]/g, '')), 0)
    return total > 0 ? '$' + total.toLocaleString('es-CO') : '$0'
  }

  const totalOportunidades = computed(() => oportunidades.value.length)
  const totalValor = computed(() => {
    const t = oportunidades.value.reduce((acc, o) => acc + parseFloat(o.valor.replace(/[^0-9]/g, '')), 0)
    return '$' + t.toLocaleString('es-CO')
  })

  return {
    draggingId, dropTarget, dropIndicator,
    onDragStart, onDragEnd, onDragOver, onDragOverCard, onDragLeave, onDrop,
    porEtapa, valorEtapa, totalOportunidades, totalValor,
  }
}

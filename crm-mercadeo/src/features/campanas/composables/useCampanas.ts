import { ref, computed } from 'vue'
import type { Campana, CampanaDraft } from '../types/campana'
import { getCampanas, createCampana } from '../services/campanas.api'

export function useCampanas() {
  const campanas = ref<Campana[]>(getCampanas())

  const enviadas = computed(() => campanas.value.filter(c => c.estado === 'Enviada'))
  const totalEnviados = computed(() => enviadas.value.reduce((acc, c) => acc + c.enviados, 0))
  const totalAperturas = computed(() => enviadas.value.reduce((acc, c) => acc + c.aperturas, 0))
  const totalClics = computed(() => enviadas.value.reduce((acc, c) => acc + c.clics, 0))
  const totalRebotes = computed(() => enviadas.value.reduce((acc, c) => acc + c.rebotes, 0))

  const crearCampana = (data: CampanaDraft) => {
    campanas.value = [createCampana(data), ...campanas.value]
  }

  return {
    campanas, totalEnviados, totalAperturas, totalClics, totalRebotes,
    crearCampana,
  }
}

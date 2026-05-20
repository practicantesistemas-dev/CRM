<template>
  <div class="space-y-4">
    <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wide">Historial de Mercadeo</h3>
    
    <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
      <div v-for="(bitacora, idx) in contacto.historial" :key="idx" class="bloque-nota">
        <div class="flex justify-between font-bold text-amber-900 mb-1 text-[11px]">
          <span>📝 Nota Comercial</span>
          <span class="text-slate-400 font-normal">Nota {{ contacto.historial.length - idx }}</span>
        </div>
        <p class="text-slate-700 text-xs">{{ bitacora }}</p>
      </div>
      
      <div v-if="contacto.historial.length === 0" class="text-xs text-slate-400 italic py-4 text-center">
        Sin interacciones registradas.
      </div>
    </div>

    <div class="border-t border-slate-100 pt-4">
      <label class="block text-xs font-bold text-slate-600 uppercase mb-1">Registrar nueva acción</label>
      <textarea 
        v-model="nuevaNota" 
        placeholder="Ej: Interesado en promoción. Volver a llamar el viernes." 
        class="w-full border border-slate-200 rounded-lg p-2 text-xs h-24 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50"
      ></textarea>
      <button @click="enviarNota" class="btn-guardar">
        Guardar Bitácora Comercial
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface ContactoSeguimiento {
  id: number
  historial: string[]
}

defineProps<{
  contacto: ContactoSeguimiento
}>()

const emit = defineEmits<{
  (e: 'nuevaNota', nota: string): void
}>()

const nuevaNota = ref<string>('')

const enviarNota = (): void => {
  if (!nuevaNota.value.trim()) return
  emit('nuevaNota', nuevaNota.value)
  nuevaNota.value = ''
}
</script>

<style scoped>
.bloque-nota {
  @apply p-2.5 bg-amber-50/60 border border-amber-100 rounded-lg;
}
.btn-guardar {
  @apply w-full mt-2 bg-amber-600 text-white text-xs font-bold p-2.5 rounded-lg hover:bg-amber-700 transition shadow-sm;
}
</style>
<template>
  <div class="space-y-4">
    <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wide">
      Servicios Contratados / Interesados
    </h3>
    
    <div v-if="contacto.servicios.length > 0" class="space-y-2">
      <div v-for="servicio in contacto.servicios" :key="servicio" class="tarjeta-servicio">
        <span class="text-sm font-medium text-slate-700">🛠️ {{ servicio }}</span>
        <span class="badge-activo">Activo</span>
      </div>
    </div>
    
    <div v-else class="text-xs text-slate-400 italic py-4 text-center">
      Este lead no tiene servicios asociados aún.
    </div>

    <button class="w-full border-2 border-dashed border-slate-300 text-slate-500 text-xs font-bold py-2 rounded-lg hover:border-blue-500 hover:text-blue-500 transition">
      + Asignar Nuevo Servicio
    </button>
  </div>
</template>

<script setup lang="ts">
interface ContactoServicios {
  id: number
  nombre: string
  servicios: string[]
}

defineProps<{
  contacto: ContactoServicios
}>()
</script>


<style scoped>
/* 💡 Corrección usando el alias de Vite */
@reference "../../../style.css";

.tarjeta-servicio {
  @apply flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 transition-colors duration-200;
}
.tarjeta-servicio:hover {
  @apply bg-slate-100;
}
.badge-activo {
  @apply text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded;
}
</style>
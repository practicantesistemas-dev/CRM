<script setup lang="ts">
const nombre = defineModel<string>('nombre', { required: true })
const emit = defineEmits<{ guardar: []; cancelar: [] }>()
</script>

<template>
  <div class="bg-white rounded-2xl border border-[#2447F9] shadow-lg p-5">
    <h4 class="text-[12px] font-bold text-[#0F172A] mb-3">Guardar segmento actual</h4>
    <div class="flex gap-2">
      <input v-model="nombre" placeholder="Nombre del segmento..." class="flex-1 h-9 px-4 rounded-lg border border-slate-200 bg-slate-50 text-[12px] outline-none focus:border-[#2447F9] focus:bg-white transition-all" @keydown.enter="emit('guardar')" />
      <button @click="emit('guardar')" class="h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold hover:bg-[#1D3DD9] transition-all">Guardar</button>
      <button @click="emit('cancelar')" class="h-9 px-3 rounded-lg border border-slate-200 text-slate-500 text-[11px] hover:bg-slate-50 transition-all">Cancelar</button>
    </div>
  </div>
</template>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-[#1A2B4C]/30 backdrop-blur-xs p-4 animate-fadeIn">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-md border-t-4 border-[#1A2B4C] overflow-hidden">
      
      <div class="px-6 py-4 bg-[#1A2B4C] text-white flex justify-between items-center">
        <div>
          <h3 class="text-xs font-black uppercase tracking-wider">Vincular Beneficiario</h3>
          <p class="text-slate-300 text-[9px] uppercase tracking-widest font-bold">Plan de Protección Familiar</p>
        </div>
        <button @click="$emit('close')" class="text-white/60 hover:text-white text-xl cursor-pointer font-light">&times;</button>
      </div>

      <div class="p-6 space-y-4 text-xs">
        <div class="bg-slate-50 border border-slate-200 p-3 rounded-lg flex justify-between items-center">
          <span class="text-[#1A2B4C] font-bold">Titular: {{ titularNombre }}</span>
          <span class="bg-slate-200 text-slate-700 text-[9px] px-2 py-0.5 rounded font-black font-mono">
            {{ miembrosActuales }} / 5 Cupos utilizados
          </span>
        </div>

        <div class="space-y-3">
          <div>
            <label class="text-[9px] font-black text-[#1A2B4C] uppercase block mb-1">Nombre Completo</label>
            <input v-model="form.nombreCompleto" type="text" class="w-full bg-slate-50 border border-slate-200 focus:border-[#1A2B4C] rounded-lg px-3 py-1.5 outline-none text-xs text-slate-800" placeholder="Nombre completo">
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="text-[9px] font-black text-[#1A2B4C] uppercase block mb-1">Tipo Doc.</label>
              <select v-model="form.tipoDocumento" class="w-full bg-slate-50 border border-slate-200 focus:border-[#1A2B4C] rounded-lg py-1.5 px-1 text-xs outline-none text-slate-700">
                <option value="RC">RC</option>
                <option value="TI">TI</option>
                <option value="CC">CC</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="text-[9px] font-black text-[#1A2B4C] uppercase block mb-1">Documento de Identidad</label>
              <input v-model="form.documento" type="text" class="w-full bg-slate-50 border border-slate-200 focus:border-[#1A2B4C] rounded-lg px-3 py-1.5 text-xs outline-none text-slate-800" placeholder="Número">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="text-[9px] font-black text-[#1A2B4C] uppercase block mb-1">Edad</label>
              <input v-model.number="form.edad" type="number" class="w-full bg-slate-50 border border-slate-200 focus:border-[#1A2B4C] rounded-lg px-3 py-1.5 text-xs outline-none text-slate-800" placeholder="Años">
            </div>
            <div>
              <label class="text-[9px] font-black text-[#1A2B4C] uppercase block mb-1">Género</label>
              <select v-model="form.genero" class="w-full bg-slate-50 border border-slate-200 focus:border-[#1A2B4C] rounded-lg py-1.5 px-1 text-xs outline-none text-slate-700">
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
              </select>
            </div>
          </div>

          <div>
            <label class="text-[9px] font-black text-[#1A2B4C] uppercase block mb-1">Parentesco</label>
            <select v-model="form.parentesco" class="w-full bg-slate-50 border border-slate-200 focus:border-[#1A2B4C] rounded-lg py-1.5 px-2 text-xs outline-none text-slate-700">
              <option value="Hijo(a)">Hijo(a)</option>
              <option value="Cónyuge">Cónyuge</option>
              <option value="Padre/Madre">Padre/Madre</option>
              <option value="Otro">Otro Familiar</option>
            </select>
          </div>
        </div>
      </div>

      <div class="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase cursor-pointer">Cancelar</button>
        <button @click="enviar" class="px-5 py-2 bg-[#1A2B4C] hover:bg-[#253A66] text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer">
          Vincular Miembro
        </button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

defineProps<{ isOpen: boolean; titularNombre: string; miembrosActuales: number }>()
const emit = defineEmits(['close', 'save'])

const form = reactive({
  nombreCompleto: '',
  tipoDocumento: 'TI',
  documento: '',
  edad: null as number | null,
  genero: 'Femenino',
  parentesco: 'Hijo(a)'
})

const enviar = () => {
  if (form.nombreCompleto && form.edad) {
    emit('save', { ...form })
    emit('close')
    form.nombreCompleto = ''
    form.documento = ''
    form.edad = null
  }
}
</script>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search } from 'lucide-vue-next'
import {
  CIUDADES, CONCEPTOS, VINCULACIONES, CANALES_ORIGEN, RESPONSABLES,
  ETAPAS_AFILIADO, SERVICIOS_CATALOGO, SERVICIOS_TOTAL,
  OPC_ULTIMO_USO, OPC_N_SERVICIOS, OPC_ANTIGUEDAD,
  type FiltroSegmento,
} from '../constants/ciclo-afiliado.constants'

const f = defineModel<FiltroSegmento>({ required: true })
const emit = defineEmits<{ aplicar: []; limpiar: [] }>()

const buscarFiltro = ref('')
const buscarServicio = ref('')
const nf = new Intl.NumberFormat('es-CO')

const visible = (label: string) =>
  !buscarFiltro.value || label.toLowerCase().includes(buscarFiltro.value.toLowerCase())

const toggle = (arr: string[], v: string) => {
  const i = arr.indexOf(v)
  if (i >= 0) arr.splice(i, 1); else arr.push(v)
}

const serviciosFiltrados = computed(() => {
  const q = buscarServicio.value.toLowerCase().trim()
  return (q ? SERVICIOS_CATALOGO.filter(s => s.toLowerCase().includes(q)) : SERVICIOS_CATALOGO).slice(0, 8)
})
const serviciosRestantes = computed(() => SERVICIOS_TOTAL - serviciosFiltrados.value.length)

const CHIP = 'text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all'
const chipCls = (on: boolean) => on
  ? 'bg-[#2447F9] border-[#2447F9] text-white'
  : 'border-slate-300 dark:border-slate-600 text-body hover:border-[#2447F9]'
</script>

<template>
  <div class="surface-card rounded-xl shadow-sm overflow-hidden lg:sticky lg:top-3">
    <div class="px-4 py-3 border-b border-default flex items-center justify-between shrink-0">
      <h3 class="text-[12px] font-bold text-heading">Filtros de segmento</h3>
      <button class="text-[10px] font-bold text-[#2447F9] hover:underline" @click="emit('limpiar')">Limpiar</button>
    </div>

    <div class="px-4 py-3 border-b border-default shrink-0">
      <div class="relative">
        <Search :size="13" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input v-model="buscarFiltro" placeholder="Buscar filtro…" class="w-full h-8 pl-8 pr-2 rounded-lg input-surface text-[11px] outline-none" />
      </div>
    </div>

    <div class="max-h-[52vh] lg:max-h-[calc(100vh-360px)] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
      <!-- Plan -->
      <section v-show="visible('Plan Plan Liga')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Plan</div>
        <div class="flex flex-wrap gap-1.5">
          <button v-for="o in ['Plan Liga', 'No plan Liga']" :key="o"
            @click="f.planLiga = (f.planLiga === o ? '' : o) as FiltroSegmento['planLiga']"
            :class="[CHIP, chipCls(f.planLiga === o)]">{{ o }}</button>
        </div>
      </section>

      <!-- Sexo -->
      <section v-show="visible('Sexo')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Sexo</div>
        <div class="flex gap-1.5">
          <button v-for="[v, l] in [['', 'Todos'], ['F', 'Mujeres'], ['M', 'Hombres']]" :key="v"
            @click="f.sexo = v as FiltroSegmento['sexo']" :class="[CHIP, chipCls(f.sexo === v)]">{{ l }}</button>
        </div>
      </section>

      <!-- Rango de edad -->
      <section v-show="visible('Rango de edad')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Rango de edad</div>
        <div class="flex items-center gap-2">
          <input v-model="f.edadMin" type="number" min="0" max="120" placeholder="mín" class="w-full h-8 px-2 rounded-lg input-surface text-[11px] outline-none" />
          <span class="text-slate-400 text-[11px]">a</span>
          <input v-model="f.edadMax" type="number" min="0" max="120" placeholder="máx" class="w-full h-8 px-2 rounded-lg input-surface text-[11px] outline-none" />
        </div>
      </section>

      <!-- Ciudad -->
      <section v-show="visible('Ciudad')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Ciudad</div>
        <div class="flex flex-wrap gap-1.5">
          <button v-for="c in CIUDADES" :key="c" @click="toggle(f.ciudades, c)"
            :class="[CHIP, chipCls(f.ciudades.includes(c))]">{{ c }}</button>
        </div>
      </section>

      <!-- Etapa del ciclo -->
      <section v-show="visible('Etapa del ciclo de vida')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Etapa del ciclo</div>
        <div class="flex flex-wrap gap-1.5">
          <button v-for="e in ETAPAS_AFILIADO" :key="e.n" @click="toggle(f.etapas, e.n)"
            :class="[CHIP, chipCls(f.etapas.includes(e.n))]">{{ e.n }}</button>
        </div>
      </section>

      <!-- Origen -->
      <section v-show="visible('Origen canal')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Origen del afiliado</div>
        <select v-model="f.origen" class="w-full h-8 px-2 rounded-lg input-surface text-[11px] outline-none cursor-pointer">
          <option value="">Cualquiera</option>
          <option v-for="o in CANALES_ORIGEN" :key="o">{{ o }}</option>
        </select>
      </section>

      <!-- Responsable -->
      <section v-show="visible('Responsable asesor')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Responsable</div>
        <select v-model="f.responsable" class="w-full h-8 px-2 rounded-lg input-surface text-[11px] outline-none cursor-pointer">
          <option value="">Todos</option>
          <option v-for="r in RESPONSABLES" :key="r">{{ r }}</option>
        </select>
      </section>

      <!-- Concepto -->
      <section v-show="visible('Concepto')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Concepto</div>
        <label v-for="c in CONCEPTOS" :key="c" class="flex items-center gap-2 py-1 text-[11px] text-body cursor-pointer">
          <input type="checkbox" class="w-3.5 h-3.5 accent-[#2447F9]" :checked="f.conceptos.includes(c)" @change="toggle(f.conceptos, c)" />{{ c }}
        </label>
      </section>

      <!-- Servicio -->
      <section v-show="visible('Servicio')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Servicio</div>
        <div class="relative mb-2">
          <Search :size="12" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input v-model="buscarServicio" placeholder="Buscar servicio…" class="w-full h-8 pl-8 pr-2 rounded-lg input-surface text-[11px] outline-none" />
        </div>
        <label v-for="s in serviciosFiltrados" :key="s" class="flex items-center gap-2 py-1 text-[11px] text-body cursor-pointer">
          <input type="checkbox" class="w-3.5 h-3.5 accent-[#2447F9]" :checked="f.servicios.includes(s)" @change="toggle(f.servicios, s)" />
          <span class="truncate">{{ s }}</span>
        </label>
        <p v-if="serviciosRestantes > 0" class="text-[10px] text-muted mt-1">+ {{ nf.format(serviciosRestantes) }} más</p>
      </section>

      <!-- Último uso -->
      <section v-show="visible('Último uso de servicios')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Último uso</div>
        <div class="flex flex-wrap gap-1.5">
          <button v-for="o in OPC_ULTIMO_USO" :key="o.v" @click="f.ultimoUso = o.v" :class="[CHIP, chipCls(f.ultimoUso === o.v)]">{{ o.l }}</button>
        </div>
      </section>

      <!-- Nº de servicios -->
      <section v-show="visible('Número de servicios usados')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Nº de servicios (12 m)</div>
        <div class="flex flex-wrap gap-1.5">
          <button v-for="o in OPC_N_SERVICIOS" :key="o.v" @click="f.nServ = o.v" :class="[CHIP, chipCls(f.nServ === o.v)]">{{ o.l }}</button>
        </div>
      </section>

      <!-- Antigüedad -->
      <section v-show="visible('Antigüedad de afiliación')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Antigüedad de afiliación</div>
        <div class="flex flex-wrap gap-1.5">
          <button v-for="o in OPC_ANTIGUEDAD" :key="o.v" @click="f.antiguedad = o.v" :class="[CHIP, chipCls(f.antiguedad === o.v)]">{{ o.l }}</button>
        </div>
      </section>

      <!-- Tipo de vinculación -->
      <section v-show="visible('Tipo de vinculación')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Tipo de vinculación</div>
        <div class="flex flex-wrap gap-1.5">
          <button v-for="o in VINCULACIONES" :key="o" @click="f.vinculacion = f.vinculacion === o ? '' : o"
            :class="[CHIP, chipCls(f.vinculacion === o)]">{{ o }}</button>
        </div>
      </section>

      <!-- Contactabilidad -->
      <section v-show="visible('Contactabilidad correo celular')" class="px-4 py-3">
        <div class="text-[10px] font-bold text-subtle uppercase tracking-wide mb-2">Contactabilidad</div>
        <label class="flex items-center gap-2 py-1 text-[11px] text-body cursor-pointer">
          <input type="checkbox" class="w-3.5 h-3.5 accent-[#2447F9]" v-model="f.conCorreo" /> Solo con correo
        </label>
        <label class="flex items-center gap-2 py-1 text-[11px] text-body cursor-pointer">
          <input type="checkbox" class="w-3.5 h-3.5 accent-[#2447F9]" v-model="f.conCelular" /> Solo con celular
        </label>
      </section>
    </div>

    <div class="px-4 py-3 border-t border-default flex gap-2 shrink-0">
      <button @click="emit('limpiar')" class="flex-1 h-9 rounded-lg border border-default bg-white dark:bg-slate-800 text-[11px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Limpiar</button>
      <button @click="emit('aplicar')" class="flex-1 h-9 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all">Aplicar</button>
    </div>
  </div>
</template>


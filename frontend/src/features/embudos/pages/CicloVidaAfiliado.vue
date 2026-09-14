<script setup lang="ts">
import { computed, onActivated, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronRight, RefreshCw, SlidersHorizontal, Send, X, Mail, Phone, Bookmark, Check } from 'lucide-vue-next'
import { AFILIADOS_MOCK, clonarFiltro, resumirFiltros } from '../constants/ciclo-afiliado.constants'
import { getSegmentoPreseleccionado } from '../composables/useSegmentoPreseleccionado'
import { useSegmentosGuardados } from '../composables/useSegmentosGuardados'
import { useSegmentador } from '../composables/useSegmentador'
import FiltrosSegmento from '../components/FiltrosSegmento.vue'
import EnviarSegmentoDialog from '../components/EnviarSegmentoDialog.vue'

const router = useRouter()
const nf = new Intl.NumberFormat('es-CO')

// El estado del segmentador (filtros + selección) vive en useSegmentador, a
// nivel de módulo: NO se reinicia al cambiar de pestaña ni al volver al hub,
// solo al recargar la página o cuando el usuario hace una acción.
const {
  f, fApp, sel, filtrados, seleccion, todoSel, nFiltros,
  aplicar: aplicarFiltro, limpiar, precargar, toggleRow, toggleTodo,
} = useSegmentador()

const mostrarFiltros = ref(false)
const aplicar = () => { aplicarFiltro(); mostrarFiltros.value = false }

// Si se llegó desde "Segmentos guardados" hay un filtro pendiente por precargar.
// getSegmentoPreseleccionado() se consume una sola vez: en una navegación
// normal devuelve null y no toca nada, así no se pierde lo que ya había.
const revisarPreseleccion = () => {
  const pre = getSegmentoPreseleccionado()
  if (pre) precargar(pre)
}
revisarPreseleccion()
onActivated(revisarPreseleccion)

const conCorreo = computed(() => seleccion.value.filter(a => a.tieneCorreo).length)
const conCelular = computed(() => seleccion.value.filter(a => a.tieneCelular).length)

const ultimoUsoTxt = (d: number | null) => d === null ? 'Nunca' : `hace ${d} d`
const ultimoUsoCls = (d: number | null) => d === null || d > 90 ? 'text-red-500 dark:text-red-400'
  : d > 45 ? 'text-amber-600 dark:text-amber-400' : 'text-muted'
const planStyle = (p: string) => p === 'Empresarial'
  ? 'text-[#1A2A6C] dark:text-indigo-300'
  : p === 'Familiar' ? 'text-[#9D174D] dark:text-pink-300' : 'text-[#1E3A8A] dark:text-blue-300'

const enviarVisible = ref(false)

// ── Guardar segmento ────────────────────────────────────────────────
const { guardar } = useSegmentosGuardados()
const guardarVisible = ref(false)
const nombreSegmento = ref('')
const guardado = ref(false)
const abrirGuardar = () => { nombreSegmento.value = ''; guardado.value = false; guardarVisible.value = true }
const confirmarGuardar = () => {
  if (!nombreSegmento.value.trim()) return
  guardar({
    nombre: nombreSegmento.value,
    filtros: clonarFiltro(fApp.value),
    criterios: resumirFiltros(fApp.value),
    personas: seleccion.value.length,
    conCorreo: conCorreo.value,
    conCelular: conCelular.value,
  })
  guardado.value = true
  setTimeout(() => { guardarVisible.value = false }, 1200)
}
</script>

<template>
  <div class="space-y-5 font-[Inter,system-ui,sans-serif]">
    <div>
      <nav class="flex items-center gap-1.5 text-[12px] mb-1.5">
        <span class="text-slate-400 dark:text-slate-500">CRM Mercadeo</span>
        <ChevronRight :size="12" class="text-slate-300 dark:text-slate-600" />
        <button class="text-slate-400 dark:text-slate-500 hover:text-[#2447F9] font-semibold transition-colors" @click="router.push('/embudos')">Embudos</button>
        <ChevronRight :size="12" class="text-slate-300 dark:text-slate-600" />
        <span class="font-bold text-[#0F172A] dark:text-slate-100">Audiencias</span>
      </nav>
      <h2 class="text-[18px] font-bold text-heading flex items-center gap-2">
        <RefreshCw :size="19" class="text-[#EC4899]" /> Audiencias
      </h2>
      <p class="text-[12px] text-body mt-0.5">
        Arma una audiencia con filtros (personas afiliadas o no a Plan Liga) y actúa sobre ella por correo o WhatsApp. Datos de ejemplo.
      </p>
    </div>

    <button
      class="lg:hidden flex items-center gap-1.5 h-9 px-3 rounded-lg border border-default bg-white dark:bg-slate-800 text-[11px] font-bold text-body"
      @click="mostrarFiltros = !mostrarFiltros"
    >
      <SlidersHorizontal :size="13" /> Filtros de segmento
      <span v-if="nFiltros" class="bg-[#2447F9] text-white text-[9px] font-bold px-1.5 rounded-full">{{ nFiltros }}</span>
    </button>

    <div class="flex flex-col lg:flex-row gap-4 items-start">
      <!-- ── Filtros ── -->
      <aside class="w-full lg:w-72 shrink-0" :class="mostrarFiltros ? 'block' : 'hidden lg:block'">
        <FiltrosSegmento v-model="f" @aplicar="aplicar" @limpiar="limpiar" />
      </aside>

      <!-- ── Resultado + tabla ── -->
      <div class="flex-1 min-w-0 space-y-4">
        <div class="surface-card rounded-xl shadow-sm px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-3 flex-wrap">
            <span class="text-[15px] font-extrabold text-heading">
              {{ nf.format(filtrados.length) }}<span class="text-[12px] text-muted font-semibold"> de {{ AFILIADOS_MOCK.length }} personas</span>
            </span>
            <span class="text-[11px] text-muted"><strong class="text-heading">{{ seleccion.length }}</strong> seleccionados</span>
            <template v-if="nFiltros">
              <span class="text-[10px] font-bold text-[#2447F9] bg-[#EEF2FF] dark:bg-blue-950/40 px-2 py-0.5 rounded-full">{{ nFiltros }} filtro(s)</span>
              <button class="text-[10px] font-bold text-muted hover:text-[#2447F9] flex items-center gap-1" @click="limpiar"><X :size="11" /> quitar</button>
            </template>
          </div>
          <div class="flex items-center gap-2">
            <button
              @click="abrirGuardar"
              :disabled="!seleccion.length"
              class="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-default bg-white dark:bg-slate-800 text-[11px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
            ><Bookmark :size="13" /> Guardar segmento</button>
            <button
              @click="enviarVisible = true"
              :disabled="!seleccion.length"
              class="flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all disabled:opacity-50"
            ><Send :size="13" /> Enviar al segmento</button>
          </div>
        </div>

        <div class="surface-card rounded-xl shadow-sm overflow-hidden">
          <div class="overflow-x-auto max-h-[62vh]">
            <table class="w-full text-[12px]">
              <thead>
                <tr class="border-b border-default text-left text-[10px] uppercase tracking-wide text-subtle">
                  <th class="px-3 py-2.5 w-8"><input type="checkbox" class="w-3.5 h-3.5 accent-[#2447F9]" :checked="todoSel" @change="toggleTodo" /></th>
                  <th class="px-3 py-2.5 font-semibold">Persona</th>
                  <th class="px-3 py-2.5 font-semibold">Dirección</th>
                  <th class="px-3 py-2.5 font-semibold">Plan</th>
                  <th class="px-3 py-2.5 font-semibold">Último uso</th>
                  <th class="px-3 py-2.5 font-semibold">Serv.</th>
                  <th class="px-3 py-2.5 font-semibold">Contacto</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="a in filtrados" :key="a.id"
                  class="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                  :class="sel.has(a.id) ? '' : 'opacity-55'"
                  @click="toggleRow(a.id)"
                >
                  <td class="px-3 py-2.5" @click.stop>
                    <input type="checkbox" class="w-3.5 h-3.5 accent-[#2447F9]" :checked="sel.has(a.id)" @change="toggleRow(a.id)" />
                  </td>
                  <td class="px-3 py-2.5">
                    <div class="font-bold text-heading">{{ a.nombre }}</div>
                    <div class="text-[10px] text-muted">CC {{ a.documento }}</div>
                  </td>
                  <td class="px-3 py-2.5 text-body">{{ a.direccion }}</td>
                  <td class="px-3 py-2.5">
                    <span class="text-[10px] font-bold" :class="planStyle(a.plan)">{{ a.plan }}</span>
                    <span class="text-[10px] text-muted"> · {{ a.vinculacion }}</span>
                  </td>
                  <td class="px-3 py-2.5 font-semibold" :class="ultimoUsoCls(a.ultimoUsoDias)">{{ ultimoUsoTxt(a.ultimoUsoDias) }}</td>
                  <td class="px-3 py-2.5 text-body tabular-nums">{{ a.nServicios }}</td>
                  <td class="px-3 py-2.5">
                    <span class="inline-flex items-center gap-1.5">
                      <Mail :size="12" :class="a.tieneCorreo ? 'text-[#2447F9]' : 'text-slate-300 dark:text-slate-600'" />
                      <Phone :size="12" :class="a.tieneCelular ? 'text-[#059669]' : 'text-slate-300 dark:text-slate-600'" />
                    </span>
                  </td>
                </tr>
                <tr v-if="!filtrados.length">
                  <td colspan="7" class="px-3 py-12 text-center text-[12px] text-muted">Ninguna persona coincide con los filtros.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="px-3 py-2 border-t border-default text-[10px] text-muted">
            {{ seleccion.length }} seleccionados · <span class="text-heading font-semibold">{{ conCorreo }}</span> con correo · <span class="text-heading font-semibold">{{ conCelular }}</span> con celular
          </div>
        </div>
      </div>
    </div>

    <EnviarSegmentoDialog v-model:visible="enviarVisible" :total="seleccion.length" />

    <!-- Guardar segmento -->
    <div v-if="guardarVisible" class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div class="surface-card rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-default surface-header">
          <h3 class="text-[14px] font-bold text-heading">Guardar segmento</h3>
          <button @click="guardarVisible = false" class="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 flex items-center justify-center text-slate-500 dark:text-slate-400"><X :size="14" /></button>
        </div>
        <div class="p-5 space-y-3">
          <div v-if="guardado" class="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[12px] font-semibold px-4 py-3 flex items-center gap-2">
            <Check :size="15" /> Segmento guardado. Aparece en "Segmentos guardados".
          </div>
          <template v-else>
            <p class="text-[11px] text-muted">
              Se guardará con los <strong class="text-heading">{{ nFiltros }}</strong> filtro(s) aplicados y
              <strong class="text-heading">{{ seleccion.length }}</strong> personas.
            </p>
            <input
              v-model="nombreSegmento"
              placeholder="Nombre del segmento"
              class="w-full h-9 px-3 rounded-lg input-surface text-[12px] outline-none focus:border-[#2447F9]"
              @keydown.enter="confirmarGuardar"
            />
          </template>
        </div>
        <div v-if="!guardado" class="flex items-center justify-end gap-2 px-5 py-4 border-t border-default surface-header">
          <button @click="guardarVisible = false" class="h-9 px-5 rounded-lg border border-default bg-white dark:bg-slate-800 text-[11px] font-semibold text-body hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Cancelar</button>
          <button
            @click="confirmarGuardar"
            :disabled="!nombreSegmento.trim()"
            class="h-9 px-6 rounded-lg bg-[#2447F9] text-white text-[11px] font-bold shadow hover:bg-[#1D3DD9] transition-all disabled:opacity-50"
          >Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

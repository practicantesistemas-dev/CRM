<script setup lang="ts">
import { ref } from 'vue'
import TableroLiga from './tableau.vue'
import {
  Users, Building2, Briefcase, Layers, ClipboardList,
  Phone, Mail, Calendar, FileText, TrendingUp, TrendingDown,
  BarChart3, Heart, Target, GitBranch, Megaphone, Zap
} from 'lucide-vue-next'

const periodo = ref('30d')

const kpis = [
  { label: 'Contactos',     valor: '1,248', delta: '+12%', positivo: true, icono: Users,        color: '#2447F9', bg: '#EEF2FF', subtexto: 'vs. mes anterior'  },
  { label: 'Titulares PL',  valor: '342',   delta: '+8%',  positivo: true, icono: Heart,        color: '#EC4899', bg: '#FCE7F3', subtexto: 'Plan Liga activos' },
  { label: 'Empresas',      valor: '86',    delta: '+5%',  positivo: true, icono: Building2,    color: '#1A2A6C', bg: '#E8EAF6', subtexto: 'vinculadas'        },
  { label: 'Oportunidades', valor: '34',    delta: '+8%',  positivo: true, icono: Briefcase,    color: '#EC4899', bg: '#FCE7F3', subtexto: 'en curso'          },
  { label: 'Servicios',     valor: '12',    delta: '0%',   positivo: true, icono: Layers,       color: '#C9A227', bg: '#FEF9C3', subtexto: 'Plan Liga activos' },
  { label: 'Seguimientos',  valor: '67',    delta: '+3%',  positivo: true, icono: ClipboardList, color: '#059669', bg: '#D1FAE5', subtexto: 'pendientes'       },
]

const actividades = [
  { tipo: 'Llamada', icono: Phone,    contacto: 'Carlos Mendoza',    empresa: 'Global Tech S.A.S',    hace: 'Hace 15 min', usuario: 'María García',  color: '#2447F9', bg: '#EEF2FF' },
  { tipo: 'Correo',  icono: Mail,     contacto: 'Ana Victoria Ruiz', empresa: 'Estética Mayo',         hace: 'Hace 1h',     usuario: 'Juan López',    color: '#EC4899', bg: '#FCE7F3' },
  { tipo: 'Reunión', icono: Calendar, contacto: 'Pedro Sánchez',     empresa: 'Constructora ABC',      hace: 'Hace 2h',     usuario: 'Carlos Torres', color: '#C9A227', bg: '#FEF9C3' },
  { tipo: 'Nota',    icono: FileText, contacto: 'Laura Gómez',       empresa: 'Farmacia Norte',        hace: 'Hace 3h',     usuario: 'María García',  color: '#059669', bg: '#D1FAE5' },
  { tipo: 'Llamada', icono: Phone,    contacto: 'Roberto Díaz',      empresa: 'Tech Solutions',        hace: 'Hace 5h',     usuario: 'Juan López',    color: '#2447F9', bg: '#EEF2FF' },
  { tipo: 'Correo',  icono: Mail,     contacto: 'Sandra Morales',    empresa: 'Grupo Empresarial XYZ', hace: 'Hace 6h',     usuario: 'Carlos Torres', color: '#EC4899', bg: '#FCE7F3' },
]

const distribucion = [
  { label: 'Activos',    porcentaje: 68, color: '#2447F9' },
  { label: 'En proceso', porcentaje: 22, color: '#C9A227' },
  { label: 'Inactivos',  porcentaje: 10, color: '#EC4899' },
]

const topServicios = [
  { nombre: 'Plan Liga Empresarial', solicitudes: 312, conversion: '42%' },
  { nombre: 'Plan Liga Individual',  solicitudes: 245, conversion: '35%' },
  { nombre: 'Brigadas de Salud',     solicitudes: 187, conversion: '28%' },
  { nombre: 'Tamizajes',             solicitudes: 134, conversion: '31%' },
]

const embudoResumen = [
  { etapa: 'Lead',            count: 12, color: '#94A3B8' },
  { etapa: 'Primer Contacto', count: 8,  color: '#2447F9' },
  { etapa: 'Cotización',      count: 5,  color: '#C9A227' },
  { etapa: 'Negociación',     count: 3,  color: '#1A2A6C' },
  { etapa: 'Ganado',          count: 6,  color: '#059669' },
]

const periodo_options = [
  { value: '7d',   label: 'Últimos 7 días' },
  { value: '30d',  label: 'Últimos 30 días' },
  { value: '90d',  label: 'Este trimestre' },
  { value: 'year', label: 'Este año' },
]
</script>

<template>
  <div class="space-y-6 max-w-[1600px] mx-auto font-[Inter,system-ui,sans-serif]">

    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-[20px] font-bold text-[#0F172A] leading-tight">Dashboard</h1>
        <p class="text-[13px] text-slate-500 mt-0.5">Resumen general · Fundación La Liga Ama Salvar Vidas</p>
      </div>
      <select
        v-model="periodo"
        class="h-8 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer"
      >
        <option v-for="o in periodo_options" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </div>

    <!-- ── KPI Cards ───────────────────────────────── -->
    <div class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
      <div
        v-for="kpi in kpis"
        :key="kpi.label"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all cursor-default"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="w-9 h-9 rounded-xl flex items-center justify-center" :style="{ backgroundColor: kpi.bg }">
            <component :is="kpi.icono" :size="17" :style="{ color: kpi.color }" />
          </div>
          <span
            class="flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
            :class="kpi.positivo ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'"
          >
            <component :is="kpi.positivo ? TrendingUp : TrendingDown" :size="9" />
            {{ kpi.delta }}
          </span>
        </div>
        <div class="text-[24px] font-bold text-[#0F172A] leading-none mb-1">{{ kpi.valor }}</div>
        <div class="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">{{ kpi.label }}</div>
        <div class="text-[10px] text-slate-400 mt-0.5">{{ kpi.subtexto }}</div>
      </div>
    </div>

    <!-- ── Main grid ───────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">

      <!-- Actividad Reciente -->
      <div class="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 class="text-[13px] font-bold text-[#0F172A]">Actividad Reciente</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">Últimas interacciones registradas</p>
          </div>
        </div>
        <div class="divide-y divide-slate-50">
          <div
            v-for="act in actividades"
            :key="act.contacto + act.hace"
            class="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/70 transition-colors"
          >
            <div class="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" :style="{ backgroundColor: act.bg }">
              <component :is="act.icono" :size="14" :style="{ color: act.color }" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[12px] font-semibold text-[#0F172A] truncate">
                {{ act.contacto }}
                <span class="font-normal text-slate-400"> · {{ act.empresa }}</span>
              </p>
              <p class="text-[11px] text-slate-400 truncate">{{ act.tipo }} · {{ act.usuario }}</p>
            </div>
            <span class="text-[10px] text-slate-400 flex-shrink-0 whitespace-nowrap">{{ act.hace }}</span>
          </div>
        </div>
      </div>

      <!-- Columna derecha -->
      <div class="flex flex-col gap-4">

        <!-- Distribución contactos -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div class="flex items-center gap-2 mb-4">
            <BarChart3 :size="14" class="text-[#2447F9]" />
            <h3 class="text-[12px] font-bold text-[#0F172A]">Distribución de Contactos</h3>
          </div>
          <div class="space-y-3">
            <div v-for="item in distribucion" :key="item.label">
              <div class="flex justify-between text-[11px] mb-1.5">
                <span class="font-medium text-slate-600">{{ item.label }}</span>
                <span class="font-bold text-[#0F172A]">{{ item.porcentaje }}%</span>
              </div>
              <div class="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :style="{ width: item.porcentaje + '%', backgroundColor: item.color }"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Top Servicios -->
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-[12px] font-bold text-[#0F172A]">Top Servicios</h3>
            <span class="text-[10px] text-slate-400">Por solicitudes</span>
          </div>
          <div class="space-y-3">
            <div v-for="(svc, idx) in topServicios" :key="svc.nombre" class="flex items-center gap-3">
              <span
                class="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0"
                :style="{ backgroundColor: idx === 0 ? '#C9A227' : idx === 1 ? '#94A3B8' : idx === 2 ? '#CD7F32' : '#CBD5E1' }"
              >{{ idx + 1 }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-[11px] font-semibold text-slate-700 truncate">{{ svc.nombre }}</p>
                <p class="text-[10px] text-slate-400">{{ svc.solicitudes }} solicitudes</p>
              </div>
              <span class="text-[11px] font-bold text-emerald-600 flex-shrink-0">{{ svc.conversion }}</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- ── Segunda fila ─────────────────────────────── -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

      <!-- Embudo resumen -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div class="flex items-center gap-2 mb-5">
          <GitBranch :size="14" class="text-[#2447F9]" />
          <h3 class="text-[13px] font-bold text-[#0F172A]">Embudo Comercial</h3>
        </div>
        <div class="flex items-end gap-3 h-28">
          <div
            v-for="etapa in embudoResumen"
            :key="etapa.etapa"
            class="flex-1 flex flex-col items-center gap-1.5"
          >
            <span class="text-[11px] font-bold text-[#0F172A]">{{ etapa.count }}</span>
            <div
              class="w-full rounded-t-lg transition-all"
              :style="{
                height: (etapa.count / embudoResumen[0].count * 96) + 'px',
                backgroundColor: etapa.color,
                opacity: 0.85
              }"
            />
            <span class="text-[9px] text-slate-400 text-center leading-tight">{{ etapa.etapa }}</span>
          </div>
        </div>
      </div>

      <!-- Módulos de acceso rápido -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <h3 class="text-[13px] font-bold text-[#0F172A] mb-4">Accesos Rápidos</h3>
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="item in [
              { label: 'Plan Liga',      icono: Heart,        color: '#EC4899', bg: '#FCE7F3' },
              { label: 'Oportunidades',  icono: Target,       color: '#2447F9', bg: '#EEF2FF' },
              { label: 'Embudos',        icono: GitBranch,    color: '#1A2A6C', bg: '#E8EAF6' },
              { label: 'Campañas',       icono: Megaphone,    color: '#C9A227', bg: '#FEF9C3' },
              { label: 'Bitácora',       icono: ClipboardList,color: '#059669', bg: '#D1FAE5' },
              { label: 'Automatización', icono: Zap,          color: '#EC4899', bg: '#FCE7F3' },
            ]"
            :key="item.label"
            class="flex flex-col items-center gap-2 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div
              class="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform"
              :style="{ backgroundColor: item.bg }"
            >
              <component :is="item.icono" :size="16" :style="{ color: item.color }" />
            </div>
            <span class="text-[10px] font-semibold text-slate-600 text-center leading-tight">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Tableau Analytics ────────────────────────── -->
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <h3 class="text-[13px] font-bold text-[#0F172A]">Analytics · Plan Liga Uso</h3>
          <p class="text-[11px] text-slate-400 mt-0.5">Dashboard embebido desde Tableau · <a class="text-[#2447F9] hover:underline cursor-pointer">Ver pantalla completa →</a></p>
        </div>
        <span class="text-[10px] font-bold text-[#2447F9] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Tableau</span>
      </div>
      <div style="height: 60vh; min-height: 400px">
        <TableroLiga />
      </div>
    </div>

  </div>
</template>

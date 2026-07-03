<script setup lang="ts">
import { useDashboard } from '../composables/useDashboard'
import KpiCards from '../components/KpiCards.vue'
import ActividadReciente from '../components/ActividadReciente.vue'
import DistribucionContactos from '../components/DistribucionContactos.vue'
import TopServicios from '../components/TopServicios.vue'
import EmbudoResumen from '../components/EmbudoResumen.vue'
import AccesosRapidos from '../components/AccesosRapidos.vue'
import TableauEmbed from '../components/TableauEmbed.vue'

const {
  periodo, periodoOptions, kpis, actividades, distribucion,
  topServicios, embudoResumen, accesosRapidos,
} = useDashboard()
</script>

<template>
  <div class="space-y-6 font-[Inter,system-ui,sans-serif]">

    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-[20px] font-bold text-[#0F172A] leading-tight">Dashboard</h1>
        <p class="text-[13px] text-slate-500 mt-0.5">Resumen general · Fundación La Liga Ama Salvar Vidas</p>
      </div>
      <select
        v-model="periodo"
        class="h-8 px-3 rounded-lg border border-slate-200 bg-white text-[11px] font-medium text-slate-600 outline-none cursor-pointer"
      >
        <option v-for="o in periodoOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
    </div>

    <KpiCards :kpis="kpis" />

    <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <ActividadReciente :actividades="actividades" />
      <div class="flex flex-col gap-4">
        <DistribucionContactos :distribucion="distribucion" />
        <TopServicios :servicios="topServicios" />
      </div>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <EmbudoResumen :etapas="embudoResumen" />
      <AccesosRapidos :accesos="accesosRapidos" />
    </div>

    <div class="rounded-2xl overflow-hidden" style="height: calc(100vh - 160px); min-height: 600px">
      <TableauEmbed />
    </div>

  </div>
</template>

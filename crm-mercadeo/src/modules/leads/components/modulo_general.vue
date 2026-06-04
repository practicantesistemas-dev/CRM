<script setup lang="ts">
import { ref, computed } from 'vue'
import TableroLiga from './tableau.vue'

type Vista = 'workflows' | 'servicios' | 'analytics'

const vistaActiva = ref<Vista>('workflows')

const buscarWorkflow = ref('')
const buscarServicio = ref('')

const workflows = ref([
  {
    id: 1,
    fase: 'captacion',
    nombre: 'Secuencia Bienvenida Automatizada',
    trigger: 'Formulario Web',
    accion: 'Notificación WhatsApp',
    cola: 142,
    conversion: '12.4%'
  },
  {
    id: 2,
    fase: 'nutricion',
    nombre: 'Recuperación de Leads Fríos',
    trigger: 'Inactividad 7 Días',
    accion: 'Email de Valor + Cupón',
    cola: 89,
    conversion: '5.8%'
  },
  {
    id: 3,
    fase: 'conversion',
    nombre: 'Recordatorio Agendamiento Clínico',
    trigger: 'Cita Pre-aprobada',
    accion: 'SMS + Confirmación',
    cola: 231,
    conversion: '42.1%'
  },
  {
    id: 4,
    fase: 'nutricion',
    nombre: 'Nutrición Pacientes Ortodoncia',
    trigger: 'Firma de Contrato',
    accion: 'Folleto WhatsApp',
    cola: 65,
    conversion: '18.2%'
  }
])

const servicios = ref([
  {
    id: 1,
    nombre: 'Diseño de Sonrisa Mockup',
    fecha: '2026-01-15',
    leads: 820,
    conversion: '38%',
    clasificacion: 'ALTA'
  },
  {
    id: 2,
    nombre: 'Profilaxis de Entrada',
    fecha: '2026-02-02',
    leads: 640,
    conversion: '26%',
    clasificacion: 'FRECUENTE'
  },
  {
    id: 3,
    nombre: 'Ortodoncia Invisible Premium',
    fecha: '2026-03-05',
    leads: 510,
    conversion: '42%',
    clasificacion: 'PREMIUM'
  },
  {
    id: 4,
    nombre: 'Endodoncia Premium',
    fecha: '2026-04-11',
    leads: 220,
    conversion: '18%',
    clasificacion: 'MEDIA'
  }
])

const workflowsFiltrados = computed(() => {
  return workflows.value.filter(w =>
    w.nombre.toLowerCase().includes(buscarWorkflow.value.toLowerCase())
  )
})

const serviciosFiltrados = computed(() => {
  return servicios.value.filter(s =>
    s.nombre.toLowerCase().includes(buscarServicio.value.toLowerCase())
  )
})
</script>


<template>
  <div class="w-full min-h-screen bg-[#f4f6f9] p-4 md:p-5 overflow-auto">

    <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 mb-5 w-full">

      <div class="bg-white rounded-2xl p-1.5 flex gap-2 shadow-sm border border-slate-200 w-fit">
        <button @click="vistaActiva = 'workflows'"
          class="px-5 py-2 rounded-xl text-[10px] font-bold tracking-wide transition-all" :class="vistaActiva === 'workflows'
              ? 'bg-[#3557ff] text-white shadow'
              : 'text-slate-500 hover:bg-slate-100'
            ">
          WORKFLOWS
        </button>

        <button @click="vistaActiva = 'servicios'"
          class="px-5 py-2 rounded-xl text-[10px] font-bold tracking-wide transition-all" :class="vistaActiva === 'servicios'
              ? 'bg-[#3557ff] text-white shadow'
              : 'text-slate-500 hover:bg-slate-100'
            ">
          SERVICIOS
        </button>

        <button @click="vistaActiva = 'analytics'"
          class="px-5 py-2 rounded-xl text-[10px] font-bold tracking-wide transition-all" :class="vistaActiva === 'analytics'
              ? 'bg-[#3557ff] text-white shadow'
              : 'text-slate-500 hover:bg-slate-100'
            ">
          ANALYTICS
        </button>
      </div>

      <div class="flex gap-3 xl:ml-auto">
        <button
          class="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-600 shadow-sm">
          Fase: todos
        </button>
        <button
          class="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[11px] font-bold text-slate-600 shadow-sm">
          Tiempo: 30d
        </button>
      </div>

    </div>

    <div v-if="vistaActiva === 'workflows'" class="flex flex-col gap-4 w-full">
      <div class="bg-white rounded-[22px] border border-slate-200 shadow-sm p-4 w-full">
        <input v-model="buscarWorkflow" type="text" placeholder="Buscar workflow..."
          class="w-full bg-[#f7f9fc] rounded-xl px-4 py-3 outline-none text-[12px] font-semibold text-slate-700 border border-slate-200" />
      </div>

      <div v-for="workflow in workflowsFiltrados" :key="workflow.id"
        class="bg-white rounded-[22px] border border-slate-200 shadow-sm px-5 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 hover:shadow-md transition-all w-full">
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-2 py-[4px] rounded-full bg-slate-100 text-[8px] font-bold uppercase text-slate-600">
              {{ workflow.fase }}
            </span>
          </div>

          <div>
            <h3 class="text-[13px] md:text-[14px] font-bold text-[#0f172a] leading-tight">
              {{ workflow.nombre }}
            </h3>
            <p class="text-[11px] text-slate-500 font-semibold mt-1">
              {{ workflow.trigger }} → {{ workflow.accion }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-5 lg:gap-7">
          <div class="text-right">
            <span class="block text-[9px] font-bold text-slate-400 uppercase">EN COLA</span>
            <strong class="text-[15px] md:text-[16px] font-bold text-[#0f172a]">{{ workflow.cola }}</strong>
          </div>
          <div class="text-right">
            <span class="block text-[9px] font-bold text-slate-400 uppercase">CONVERSIÓN</span>
            <strong class="text-[15px] md:text-[16px] font-bold text-[#10b981]">{{ workflow.conversion }}</strong>
          </div>
        </div>
      </div>
    </div>

    <div v-if="vistaActiva === 'servicios'" class="flex flex-col gap-5 w-full">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

        <div class="bg-white rounded-[20px] border border-slate-200 shadow-sm p-4 w-full">
          <div class="mb-3">
            <h3 class="text-[12px] font-bold text-[#0f172a]">Top Servicios</h3>
            <p class="text-[10px] text-slate-400 font-medium mt-0.5">Más demandados</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-[10px] font-medium text-slate-600 truncate mr-1">Diseño Sonrisa</span>
                <strong class="text-[10px] font-bold text-slate-700">820</strong>
              </div>
              <div class="w-full h-[6px] bg-slate-100 rounded-full overflow-hidden">
                <div class="w-[92%] h-full bg-[#3557ff] rounded-full"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-[10px] font-medium text-slate-600 truncate mr-1">Profilaxis</span>
                <strong class="text-[10px] font-bold text-slate-700">640</strong>
              </div>
              <div class="w-full h-[6px] bg-slate-100 rounded-full overflow-hidden">
                <div class="w-[76%] h-full bg-[#10b981] rounded-full"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-1">
                <span class="text-[10px] font-medium text-slate-600 truncate mr-1">Ortodoncia Premium</span>
                <strong class="text-[10px] font-bold text-slate-700">510</strong>
              </div>
              <div class="w-full h-[6px] bg-slate-100 rounded-full overflow-hidden">
                <div class="w-[58%] h-full bg-violet-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-[20px] border border-slate-200 shadow-sm p-4 w-full flex flex-col justify-between">
          <div class="mb-2">
            <h3 class="text-[12px] font-bold text-[#0f172a]">Menor Rendimiento</h3>
            <p class="text-[10px] text-slate-400 font-medium mt-0.5">Conversión más baja</p>
          </div>

          <div class="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl">
            <div>
              <strong class="text-[11px] font-bold text-slate-700">Endodoncia Premium</strong>
              <p class="text-[9px] text-slate-400 font-medium mt-0.5">Conversión baja</p>
            </div>
            <span class="text-[13px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg">18%</span>
          </div>
        </div>

      </div>

      <div class="bg-white rounded-[20px] border border-slate-200 shadow-sm overflow-hidden h-fit w-full">

        <div class="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-[13px] font-bold text-[#0f172a]">Servicios Activos</h2>
            <p class="text-[10px] text-slate-400 font-medium mt-0.5">
              Rendimiento comercial y comportamiento
            </p>
          </div>

          <div class="flex items-center gap-2">
            <input v-model="buscarServicio" type="text" placeholder="Buscar servicio..."
              class="bg-[#f7f9fc] rounded-xl px-3 h-[38px] outline-none text-[11px] font-medium border border-slate-200 w-full sm:w-[220px]" />

            <select
              class="bg-white border border-slate-200 rounded-xl px-3 h-[38px] text-[11px] font-bold text-slate-600 outline-none cursor-pointer">
              <option>Todos</option>
              <option>WhatsApp</option>
              <option>Correo</option>
              <option>Llamada</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto w-full">
          <table class="w-full min-w-[800px] table-auto">
            <thead class="bg-[#f8fafc]">
              <tr>
                <th class="text-left px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider w-[35%]">
                  Servicio
                </th>
                <th class="text-left px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th class="text-left px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Leads
                </th>
                <th class="text-left px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Conversión
                </th>
                <th class="text-left px-5 py-3 text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-slate-100">
              <tr v-for="servicio in serviciosFiltrados" :key="servicio.id" class="hover:bg-slate-50/70 transition-all">
                <td class="px-5 py-3.5">
                  <div class="flex flex-col">
                    <strong class="text-[11px] font-bold text-slate-700 leading-tight">
                      {{ servicio.nombre }}
                    </strong>
                    <span class="text-[9px] text-slate-400 font-medium mt-0.5">
                      Campaña automatizada
                    </span>
                  </div>
                </td>


                <td class="px-5 py-3.5 text-[10px] font-medium text-slate-500">
                  {{ servicio.fecha }}
                </td>

                <td class="px-5 py-3.5">
                  <strong class="text-[11px] font-bold text-slate-800">
                    {{ servicio.leads }}
                  </strong>
                </td>

                <td class="px-5 py-3.5">
                  <strong class="text-[11px] font-bold text-[#10b981]">
                    {{ servicio.conversion }}
                  </strong>
                </td>

                <td class="px-5 py-3.5">
                  <span class="px-2.5 py-[4px] rounded-full text-[8px] font-bold uppercase tracking-wide inline-block"
                    :class="servicio.clasificacion === 'ALTA'
                        ? 'bg-green-50 text-green-600'
                        : servicio.clasificacion === 'PREMIUM'
                          ? 'bg-indigo-50 text-indigo-600'
                          : servicio.clasificacion === 'MEDIA'
                            ? 'bg-orange-50 text-orange-600'
                            : 'bg-slate-100 text-slate-600'
                      ">
                    {{ servicio.clasificacion }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>

    <div v-if="vistaActiva === 'analytics'" class="w-full h-full">
      <main class="bg-gray-50 p-6 md:p-12 rounded-[20px] border border-slate-200 mt-2">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-2xl font-bold text-gray-800 mb-6">
            Informe de Plan de Uso
          </h1>
          <div
            class="w-full h-[85vh] min-h-[600px] border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white mt-4">

            <TableroLiga />

          </div>
        </div>
      </main>
    </div>

  </div>
</template>

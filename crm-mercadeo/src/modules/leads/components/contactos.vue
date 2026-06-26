<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  contactos: {
    id: number
    nombre: string
    cargo: string
    email: string
    telefono: string
    empresa: string
    estado: string
  }[]
}>()

const contactosLocal = ref([...props.contactos])

const buscar = ref('')

const modalAgregarAbierto = ref(false)

const filtrosAbiertos = ref(false)

const menuTop = ref(0)
const menuLeft = ref(0)

const subMenuActivo = ref<
  'rol' | 'estado' | 'origen' | 'campana' | 'edad' | null
>(null)

const subMenuTop = ref(0)
const subMenuLeft = ref(0)

const filtroRolLocal = ref('todos')
const filtroEstadoLocal = ref('todos')
const filtroOrigenLocal = ref('todos')
const filtroCampanaLocal = ref('todos')
const filtroEdadLocal = ref('todos')

const contactosFiltrados = computed(() => {
  return contactosLocal.value.filter(contacto => {
    const coincideBusqueda =
      contacto.nombre.toLowerCase().includes(buscar.value.toLowerCase()) ||
      contacto.email.toLowerCase().includes(buscar.value.toLowerCase()) ||
      contacto.empresa.toLowerCase().includes(buscar.value.toLowerCase())

    const coincideEstado =
      filtroEstadoLocal.value === 'todos' ||
      contacto.estado === filtroEstadoLocal.value

    return coincideBusqueda && coincideEstado
  })
})

const agregarContacto = () => {
  modalAgregarAbierto.value = true
}

const conteoFiltrosActivos = computed(() => {
  let total = 0

  if (filtroRolLocal.value !== 'todos') total++
  if (filtroEstadoLocal.value !== 'todos') total++
  if (filtroOrigenLocal.value !== 'todos') total++
  if (filtroCampanaLocal.value !== 'todos') total++
  if (filtroEdadLocal.value !== 'todos') total++

  return total
})

const alternarMenuPrincipal = (event: MouseEvent) => {
  filtrosAbiertos.value = !filtrosAbiertos.value

  if (filtrosAbiertos.value) {
    subMenuActivo.value = null

    const target = event.currentTarget as HTMLElement
    const rect = target.getBoundingClientRect()

    menuTop.value = rect.top

    // ancho del menú = 220px
    // separación de 8px respecto a la tuerca
    menuLeft.value = rect.left - 250
  }
}  

const abrirSubMenu = (  
  event: MouseEvent,
  tipo: 'rol' | 'estado' | 'origen' | 'campana' | 'edad'
) => {
  if (subMenuActivo.value === tipo) {
    subMenuActivo.value = null
    return
  }

  subMenuActivo.value = tipo

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()

  subMenuTop.value = rect.top - 4
  subMenuLeft.value = rect.right + 8
}

const clickFuera = (e: MouseEvent) => {
  const target = e.target as HTMLElement

  if (
    filtrosAbiertos.value &&
    !target.closest('.btn-ajustes-trigger') &&
    !target.closest('.panel-flotante-root') &&
    !target.closest('.panel-sub-flotante')
  ) {
    filtrosAbiertos.value = false
    subMenuActivo.value = null
  }
}

onMounted(() => {
  document.addEventListener('click', clickFuera)
})

onUnmounted(() => {
  document.removeEventListener('click', clickFuera)
})

const textoRolActivo = computed(() => {
  switch (filtroRolLocal.value) {
    case 'titular':
      return 'Titulares'
    case 'beneficiario':
      return 'Beneficiarios'
    default:
      return 'Filtrar por Rol'
  }
})

const textoEstadoActivo = computed(() => {
  switch (filtroEstadoLocal.value) {
    case 'Prospecto':
      return 'Solo Prospectos'
    case 'Cliente':
      return 'Solo Clientes'
    default:
      return 'Filtrar por Estado'
  }
})

const textoOrigenActivo = computed(() => {
  return filtroOrigenLocal.value === 'todos'
    ? 'Canal de Origen'
    : filtroOrigenLocal.value
})

const textoCampanaActiva = computed(() => {
  switch (filtroCampanaLocal.value) {
    case 'Registro Manual':
      return 'Manual'
    case 'Campaña Black Friday':
      return 'Black Friday'
    case 'Inscripción Orgánica':
      return 'Orgánica'
    default:
      return 'Filtrar Campaña'
  }
})

const textoEdadActiva = computed(() => {
  switch (filtroEdadLocal.value) {
    case 'menores':
      return 'Menores (<18)'
    case 'adultos':
      return 'Adultos (18-60)'
    case 'mayores':
      return 'Mayores (>60)'
    default:
      return 'Rango de Edad'
  }
})
</script>


  <template>
    <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      <!-- Header -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">

        <div class="flex gap-2">

          <button
            class="px-5 h-11 rounded-lg bg-[#3557ff] text-white text-[11px] font-bold uppercase shadow">
            CONTACTOS {{ contactosLocal.length }}
          </button>

          <button
            class="px-5 h-11 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-bold uppercase">
            PROSPECTOS 0
          </button>

        </div>

        <div class="flex gap-3">

          <button
            @click="modalAgregarAbierto = true"
            class="h-11 px-6 rounded-lg bg-[#3557ff] text-white text-[11px] font-bold uppercase shadow hover:bg-blue-700">

            + Nuevo contacto

          </button>

          <button
            class="h-11 px-6 rounded-lg border border-slate-200 bg-white text-[11px] font-bold uppercase">

            Exportar

          </button>

        </div>

      </div>

      <!-- Buscador -->

      <div class="flex gap-3 mb-5">

        <input
          v-model="buscar"
          placeholder="Buscar contacto por nombre, email o empresa..."
          class="flex-1 h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-blue-500"
        >

        <button
          @click="alternarMenuPrincipal($event)"
          :class="[
            'btn-ajustes-trigger w-12 h-12 rounded-xl border transition-all flex items-center justify-center',
            filtrosAbiertos
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'border-slate-200 bg-white hover:bg-slate-50'
          ]"
        >
          ⚙️

          <span
            v-if="conteoFiltrosActivos>0"
            class="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full text-[9px] px-1"
          >
            {{ conteoFiltrosActivos }}
          </span>
        </button>

        <button
            @click="modalAgregarAbierto=true"
            class="w-12 h-12 rounded-xl bg-[#3557ff] text-white text-xl hover:bg-blue-700"
        >
        +
        </button>

      </div>

      <!-- Tabla -->

      <div class="overflow-x-auto">

        <table class="w-full">

          <thead>

            <tr class="bg-slate-100 text-slate-500 text-[11px] uppercase">

              <th class="text-left p-4">Nombre</th>
              <th class="text-left p-4">Email / Teléfono</th>
              <th class="text-left p-4">Empresa</th>
              <th class="text-left p-4">Segmento</th>
              <th class="text-left p-4">Estado</th>

            </tr>

          </thead>

          <tbody>

            <tr
              v-for="contacto in contactosFiltrados"
              :key="contacto.id"
              class="border-b hover:bg-slate-50 transition">

              <!-- Nombre -->

              <td class="p-4">

                <div class="flex items-center gap-3">

                  <div
                    class="w-11 h-11 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">

                    {{
                      contacto.nombre
                        .split(' ')
                        .map(n => n[0])
                        .slice(0,2)
                        .join('')
                    }}

                  </div>

                  <div>

                    <div class="font-bold text-slate-800">
                      {{ contacto.nombre }}
                    </div>

                    <div class="text-xs text-slate-500">
                      {{ contacto.cargo }}
                    </div>

                  </div>

                </div>

              </td>

              <!-- Email -->

              <td class="p-4">

                <div class="font-medium">
                  {{ contacto.email }}
                </div>

                <div class="text-xs text-slate-500 mt-1">
                  {{ contacto.telefono }}
                </div>

              </td>

              <!-- Empresa -->

              <td class="p-4">

                {{ contacto.empresa }}

              </td>

              <!-- Segmento -->

              <td class="p-4">

                <div class="flex gap-2">

                  <span
                    class="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold">

                    NUTRICIÓN

                  </span>

                  <span
                    class="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-bold">

                    VIP

                  </span>

                </div>

              </td>

              <!-- Estado -->

              <td class="p-4">

                <span
                  class="px-3 py-1 rounded-full text-[10px] font-bold"
                  :class="{
                    'bg-green-100 text-green-700': contacto.estado=='ACTIVO',
                    'bg-yellow-100 text-yellow-700': contacto.estado=='EN ESPERA',
                    'bg-blue-100 text-blue-700': contacto.estado=='CLIENTE'
                  }">

                  {{ contacto.estado }}

                </span>

              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>


    <Teleport to="body">

      <!-- MENÚ PRINCIPAL -->
<div
  v-if="filtrosAbiertos"
  class="panel-flotante-root fixed z-[99999] bg-white rounded-xl border border-slate-200 shadow-2xl p-2 w-[220px]"
  :style="{ top: `${menuTop}px`, left: `${menuLeft}px` }"
>
  <div class="px-2 py-2 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
    Filtros avanzados
  </div>

  <button
    @click="abrirSubMenu($event,'rol')"
    class="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-slate-100 text-xs"
  >
    <span>{{ textoRolActivo }}</span>
    ▶
  </button>

  <button
    @click="abrirSubMenu($event,'estado')"
    class="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-slate-100 text-xs"
  >
    <span>{{ textoEstadoActivo }}</span>
    ▶
  </button>

  <button
    @click="abrirSubMenu($event,'origen')"
    class="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-slate-100 text-xs"
  >
    <span>{{ textoOrigenActivo }}</span>
    ▶
  </button>

  <button
    @click="abrirSubMenu($event,'campana')"
    class="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-slate-100 text-xs"
  >
    <span>{{ textoCampanaActiva }}</span>
    ▶
  </button>

  <button
    @click="abrirSubMenu($event,'edad')"
    class="w-full flex justify-between items-center px-3 py-2 rounded-lg hover:bg-slate-100 text-xs"
  >
    <span>{{ textoEdadActiva }}</span>
    ▶
  </button>
</div>

<!-- SUBMENÚ -->
<div
  v-if="filtrosAbiertos && subMenuActivo"
  class="panel-sub-flotante fixed z-[100000] bg-white rounded-xl border border-slate-200 shadow-2xl p-1 w-[190px]"
  :style="{ top: `${subMenuTop}px`, left: `${subMenuLeft}px` }"
>

  <!-- ROL -->
  <template v-if="subMenuActivo==='rol'">

    <button
      @click="filtroRolLocal='todos';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Todos
    </button>

    <button
      @click="filtroRolLocal='titular';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Titulares
    </button>

    <button
      @click="filtroRolLocal='beneficiario';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Beneficiarios
    </button>

  </template>

  <!-- ESTADO -->
  <template v-if="subMenuActivo==='estado'">

    <button
      @click="filtroEstadoLocal='todos';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Todos
    </button>

    <button
      @click="filtroEstadoLocal='Prospecto';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Prospectos
    </button>

    <button
      @click="filtroEstadoLocal='Cliente';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Clientes
    </button>

  </template>

  <!-- ORIGEN -->
  <template v-if="subMenuActivo==='origen'">

    <button
      @click="filtroOrigenLocal='todos';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Todos
    </button>

    <button
      @click="filtroOrigenLocal='Llamada Directa';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Llamada Directa
    </button>

    <button
      @click="filtroOrigenLocal='Formulario Web';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Formulario Web
    </button>

    <button
      @click="filtroOrigenLocal='WhatsApp';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      WhatsApp
    </button>

  </template>

  <!-- CAMPAÑA -->
  <template v-if="subMenuActivo==='campana'">

    <button
      @click="filtroCampanaLocal='todos';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Todas
    </button>

    <button
      @click="filtroCampanaLocal='Registro Manual';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Registro Manual
    </button>

    <button
      @click="filtroCampanaLocal='Campaña Black Friday';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Black Friday
    </button>

    <button
      @click="filtroCampanaLocal='Inscripción Orgánica';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Orgánica
    </button>

  </template>

  <!-- EDAD -->
  <template v-if="subMenuActivo==='edad'">

    <button
      @click="filtroEdadLocal='todos';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Todas
    </button>

    <button
      @click="filtroEdadLocal='menores';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Menores (&lt;18)
    </button>

    <button
      @click="filtroEdadLocal='adultos';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Adultos (18-60)
    </button>

    <button
      @click="filtroEdadLocal='mayores';subMenuActivo=null"
      class="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-xs">
      Mayores (&gt;60)
    </button>

  </template>

</div>
    <!-- MODAL NUEVO CONTACTO -->

    <div
        v-if="modalAgregarAbierto"
        class="fixed inset-0 bg-black/40 flex items-center justify-center z-[999999]"
    >

        <div
            class="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
        >

            <div
                class="flex justify-between items-center border-b p-4 bg-slate-50"
            >

                <h3 class="font-bold text-sm uppercase">
                    Nuevo contacto
                </h3>

                <button
                    @click="modalAgregarAbierto=false"
                    class="text-xl"
                >
                    ✕
                </button>

            </div>

            <div class="p-5 space-y-3">

                <input
                    placeholder="Nombre"
                    class="w-full border rounded-lg p-3"
                >

                <input
                    placeholder="Email"
                    class="w-full border rounded-lg p-3"
                >

                <input
                    placeholder="Teléfono"
                    class="w-full border rounded-lg p-3"
                >

                <input
                    placeholder="Empresa"
                    class="w-full border rounded-lg p-3"
                >

            </div>

            <div
                class="flex justify-end gap-2 p-4 border-t bg-slate-50"
            >

                <button
                    @click="modalAgregarAbierto=false"
                    class="px-4 py-2 rounded-lg border"
                >
                    Cancelar
                </button>

                <button
                    class="px-4 py-2 rounded-lg bg-[#3557ff] text-white"
                >
                    Guardar
                </button>

            </div>

        </div>

    </div>

  </Teleport>
  </template>
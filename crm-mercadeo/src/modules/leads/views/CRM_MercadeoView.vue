
    <script setup lang="ts">
    import { ref, shallowRef, watch, computed } from 'vue'

    // --- IMPORTACIONES COMPLEMENTARIAS ---
    import Bitacora from '../components/bitacora.vue'
    import GestionMasiva from '../components/gestion_masiva.vue' // Ajusta la ruta relativa según corresponda
    import VincularBeneficiario from '../components/vincular_beneficiario.vue'

    //control de sub-pestañas internas del panel derecho
    const subTabDerechoActivo = ref<'bitacora' | 'gestion'>('bitacora')
    const nuevaNota = ref('')


    // Función para manejar la subida del Excel devuelta por el componente hijo
    const procesarArchivoExcelCargado = (payload: { seccion: string, archivo: File }) => {
      alert(`Archivo de tipo [${payload.seccion}] recibido con éxito: ${payload.archivo.name}. Listo para procesamiento masivo.`);
      // Aquí puedes integrar tu lógica con librerías tipo 'xlsx' o llamadas Multipart a tu API backend.
    }

    // --- ESTADOS DE CONTROL ---
    const panelIzquierdoVisible = ref<boolean>(true)
    const panelDerechoVisible = ref<boolean>(true)
    const modoVista = ref<'general' | 'particular'>('general')
    const subVistaActiva = ref<'automatizaciones' | 'servicios'>('automatizaciones')
    const isModalBeneficiarioOpen = ref<boolean>(false)

    // --- INTERFACES DE MODELO ---
    interface ServicioParticular { nombre: string; fecha: string; estado: 'Activo' | 'Terminado'; }
    interface Beneficiario { nombreCompleto: string; tipoDocumento: string; documento: string; edad: number; genero: string; telefono?: string; parentesco: string; }
    interface Contacto { idUnico: string; nombreCompleto: string; rol: 'titular' | 'beneficiario'; tipoDocumento: string; documento: string; telefono: string; whatsapp: string; email: string; ciudad: string; pais: string; canalOrigen: string; campana: string; estadoLead: string; ultimoContacto: string; proximoContacto: string; cantidadLlamadas: number; cantidadEmails: number; notes?: string; edad: number; genero: string; serviciosHistoricos: ServicioParticular[]; beneficiariosAsociados?: Beneficiario[]; }

    // --- FILTROS DE BÚSQUEDA ---
    const busqueda = ref<string>('')
    const filtroRol = ref<string>('todos')
    const filtroEstado = ref<string>('todos')
    const filtroOrigen = ref<string>('todos')
    const filtroCampana = ref<string>('todos')
    const filtroEdad = ref<string>('todos')
    const busquedaCriterioServicio = ref<string>('')

    const contactosFiltrados = shallowRef<Contacto[]>([])
    const contactoSeleccionado = ref<Contacto | null>(null)

    const calcularTotalMiembros = (c: Contacto): number => {
      return 1 + (c.beneficiariosAsociados?.length || 0);
    }

    const capturarYVincularBeneficiario = (nuevoBeneficiario: Beneficiario) => {
      if (!contactoSeleccionado.value) return;
      if (!contactoSeleccionado.value.beneficiariosAsociados) {
        contactoSeleccionado.value.beneficiariosAsociados = [];
      }
      if (calcularTotalMiembros(contactoSeleccionado.value) < 5) {
        contactoSeleccionado.value.beneficiariosAsociados.push(nuevoBeneficiario);
      }
    }

    const guardarNotaGestion = () => {
      if (contactoSeleccionado.value) {
        alert(`Gestión guardada exitosamente en el Plan Liga para ${contactoSeleccionado.value.nombreCompleto}`);
      }
    }

    const serviciosHistoricosFiltrados = computed(() => {
      if (!contactoSeleccionado.value) return []
      const criterio = busquedaCriterioServicio.value.trim().toLowerCase()
      if (!criterio) return contactoSeleccionado.value.serviciosHistoricos
      return contactoSeleccionado.value.serviciosHistoricos.filter(serv => 
        serv.nombre.toLowerCase().includes(criterio) || serv.fecha.includes(criterio)
      )
    })

    const cargarData = () => {
      const mock: Contacto[] = [
        {
          idUnico: "PL-2410",
          nombreCompleto: "Carlos Mendoza",
          rol: "titular",
          tipoDocumento: "CC",
          documento: "10293844",
          telefono: "300-555-0192",
          whatsapp: "+57 300 5550192",
          email: "carlos.mendoza@constructora.com",
          ciudad: "Pereira",
          pais: "Colombia",
          canalOrigen: "Facebook Ads",
          campana: "Estética Mayo",
          estadoLead: "Interesado",
          ultimoContacto: "2026-05-19",
          proximoContacto: "2026-05-24",
          cantidadLlamadas: 4,
          cantidadEmails: 12,
          notes: "Interesado en revisión corporativa para el núcleo familiar.",
          edad: 35,
          genero: "Masculino",
          serviciosHistoricos: [
            { nombre: "Profilaxis de Entrada", fecha: "2026-03-15", estado: "Terminado" },
            { nombre: "Ortodoncia de Avanzada", fecha: "2026-05-10", estado: "Activo" }
          ],
          beneficiariosAsociados: [
            { nombreCompleto: "Laura Mendoza", tipoDocumento: "TI", documento: "110293", edad: 12, genero: "Femenino", parentesco: "Hijo(a)" }
          ]
        }
      ]

      contactosFiltrados.value = mock.filter(c => {
        const coincideBusqueda = c.nombreCompleto.toLowerCase().includes(busqueda.value.toLowerCase()) || c.documento.includes(busqueda.value);
        const coincideRol = filtroRol.value === 'todos' || c.rol === filtroRol.value;
        const coincideEstado = filtroEstado.value === 'todos' || c.estadoLead === filtroEstado.value;
        return coincideBusqueda && coincideRol && coincideEstado;
      });
    }

    const seleccionarContacto = (contacto: Contacto) => {
      contactoSeleccionado.value = contacto;
      modoVista.value = 'particular'; 
    }

    const activarModoParticular = () => {
      if (contactoSeleccionado.value) modoVista.value = 'particular';
    }

    const agregarBitacora = (item) => {
        if (!contactoSeleccionado.value) return

        if (!contactoSeleccionado.value.bitacora) {
          contactoSeleccionado.value.bitacora = []
        }

        contactoSeleccionado.value.bitacora.push(item)
      }

    watch([busqueda, filtroRol, filtroEstado], () => { cargarData() })
    cargarData()
    </script>

    <template>
      <div class="min-h-screen bg-slate-50 font-sans flex flex-col text-slate-800 antialiased w-full overflow-hidden select-none">
        <header class="bg-gradient-to-r from-blue-700 via-blue-800 to-blue-950 text-white h-14 px-5 flex justify-between items-center shadow-md shrink-0 z-30 border-b border-blue-900/40">
          <div class="flex items-center gap-4">
            <div class="flex items-center h-9">
              <img 
                src="/logo-liga-50.png" 
                alt="Fundación La Liga" 
                class="h-full w-auto object-contain brightness-0 invert select-none pointer-events-none"
              />
            </div>
            <div class="h-6 w-px bg-blue-600/60"></div>
            <div>
              <span class="text-[9px] text-blue-200 block font-bold uppercase tracking-widest leading-none">Plataforma Institucional</span>
              <h1 class="text-xs font-black tracking-wider text-white uppercase mt-0.5">CRM Mercadeo</h1>
            </div>
          </div>
          
          <div class="flex items-center gap-4 text-xs font-semibold">
            <div class="h-8 w-px bg-blue-600/60"></div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center font-black text-white text-xs shadow-inner">
                PL
              </div>
              <button @click="$emit('logout')" class="text-[10px] uppercase font-black tracking-wider text-blue-200 hover:text-pink-300 transition-colors cursor-pointer px-2 py-1 rounded hover:bg-white/5">
                Salir
              </button>
            </div>
          </div>
        </header>

        <div class="flex-1 flex p-3 gap-3 w-full min-h-0 relative overflow-hidden">
          
          <section 
            :class="[
              'bg-white rounded-xl border border-slate-200/80 flex flex-col min-h-0 shadow-xs transition-all duration-300 relative shrink-0',
              panelIzquierdoVisible ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none border-none'
            ]"
          >
            <div class="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center shrink-0 rounded-t-xl">
              <span class="text-[10px] font-black uppercase text-slate-500 tracking-widest">Bandeja de Inteligencia</span>
              <span class="text-[10px] bg-blue-700 text-white font-mono px-2 py-0.5 rounded-md font-black shadow-xs">{{ contactosFiltrados.length }}</span>
            </div>

            <div class="p-3 bg-white border-b border-slate-100 space-y-3 shrink-0 shadow-2xs">
              <div class="relative">
                <input 
                  v-model="busqueda" 
                  type="text" 
                  placeholder="Buscar Cédula, Nombre o Teléfono..." 
                  class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-2 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-all shadow-inner" 
                />
              </div>

              <div>
                <label class="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Tipo de Contacto</label>
                <div class="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold text-center">
                  <button @click="filtroRol = 'todos'" :class="['py-1 rounded-md cursor-pointer transition-all', filtroRol === 'todos' ? 'bg-white text-blue-800 shadow-xs font-black' : 'text-slate-400 hover:text-slate-600']">Todos</button>
                  <button @click="filtroRol = 'titular'" :class="['py-1 rounded-md cursor-pointer transition-all', filtroRol === 'titular' ? 'bg-white text-blue-800 shadow-xs font-black' : 'text-slate-400 hover:text-slate-600']">Titulares</button>
                  <button @click="filtroRol = 'beneficiario'" :class="['py-1 rounded-md cursor-pointer transition-all', filtroRol === 'beneficiario' ? 'bg-white text-blue-800 shadow-xs font-black' : 'text-slate-400 hover:text-slate-600']">Benefic.</button>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 text-xs pt-1">
                <div class="space-y-0.5">
                  <label class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Estado Comercial</label>
                  <select v-model="filtroEstado" class="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all">
                    <option value="todos">Todos</option>
                    <option value="Prospecto">Prospecto</option>
                    <option value="Interesado">Interesado</option>
                    <option value="Cita Agendada">Cita Agendada</option>
                    <option value="Cliente Cerrado">Cliente Cerrado</option>
                  </select>
                </div>
                <div class="space-y-0.5">
                  <label class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Canal Origen</label>
                  <select v-model="filtroOrigen" class="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all">
                    <option value="todos">Todos</option>
                    <option value="Facebook Ads">Facebook Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="WhatsApp Directo">WhatsApp Directo</option>
                  </select>
                </div>
                <div class="space-y-0.5">
                  <label class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Campaña Activa</label>
                  <select v-model="filtroCampana" class="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all">
                    <option value="todos">Todas</option>
                    <option value="Estética Mayo">Estética Mayo</option>
                    <option value="Ortodoncia">Ortodoncia</option>
                  </select>
                </div>
                <div class="space-y-0.5">
                  <label class="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Segmento Edad</label>
                  <select v-model="filtroEdad" class="w-full bg-slate-50 border border-slate-200 rounded-md p-1.5 font-semibold text-slate-700 outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all">
                    <option value="todos">Cualquiera</option>
                    <option value="joven">Jóvenes (&lt; 25)</option>
                    <option value="adulto">Adultos (25-50)</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scroll">
              <div 
                v-for="contacto in contactosFiltrados" 
                :key="contacto.idUnico" 
                @click="seleccionarContacto(contacto)"
                :class="['p-3.5 cursor-pointer transition-all border-l-4 relative', (modoVista === 'particular' && contactoSeleccionado?.idUnico === contacto.idUnico) ? 'bg-blue-50/50 border-pink-500' : 'border-transparent hover:bg-slate-50/80']"
              >
                <div class="flex justify-between items-start gap-2">
                  <div class="min-w-0">
                    <h4 class="font-black text-xs text-slate-900 truncate tracking-tight">{{ contacto.nombreCompleto }}</h4>
                    <p class="text-[10px] text-slate-400 mt-1 font-medium tracking-wide">{{ contacto.campana }}</p>
                  </div>
                  <span class="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-[9px] font-black uppercase shrink-0 tracking-wider">
                    {{ contacto.rol }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <button @click="panelIzquierdoVisible = !panelIzquierdoVisible" class="bg-slate-200 text-slate-600 hover:bg-blue-700 hover:text-white w-4 h-12 self-center flex items-center justify-center rounded-r-md shadow-xs cursor-pointer z-40 shrink-0 transition-all border border-l-0 border-slate-300 -ml-3">
            <span class="text-[8px] font-black font-mono">{{ panelIzquierdoVisible ? '◀' : '▶' }}</span>
          </button>

          <section class="flex-1 flex flex-col bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden min-h-0">
            
            <div class="flex border-b border-slate-200 bg-slate-50 px-4 pt-2.5 shrink-0 gap-1.5">
              <button 
                @click="modoVista = 'general'" 
                :class="['px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all border-t border-x rounded-t-lg cursor-pointer', modoVista === 'general' ? 'border-slate-200 border-b-white bg-white text-blue-900' : 'border-transparent text-slate-400 hover:text-slate-600']"
              >
                Módulo General (Global)
              </button>
              <button 
                @click="activarModoParticular" 
                :disabled="!contactoSeleccionado"
                :class="['px-4 py-2 text-[11px] font-black uppercase tracking-wider transition-all border-t border-x rounded-t-lg flex items-center gap-1.5', !contactoSeleccionado ? 'opacity-30 cursor-not-allowed text-slate-300' : 'cursor-pointer', modoVista === 'particular' ? 'border-slate-200 border-b-white bg-white text-pink-600' : 'border-transparent text-slate-400 hover:text-pink-500']"
              >
                Ficha Particular: {{ contactoSeleccionado ? contactoSeleccionado.nombreCompleto : 'Ninguno Seleccionado' }}
              </button>
            </div>

            <div v-if="modoVista === 'general'" class="flex-1 flex flex-col min-h-0 overflow-y-auto p-5 bg-white">
              
              <div class="flex border-b border-slate-200 bg-slate-50/50 p-1 rounded-lg shrink-0 gap-1 max-w-md">
                <button @click="subVistaActiva = 'automatizaciones'" :class="['flex-1 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all rounded-md cursor-pointer text-center', subVistaActiva === 'automatizaciones' ? 'bg-white text-blue-800 shadow-2xs border border-slate-200/40' : 'text-slate-400 hover:text-slate-600']">
                  Workflows & Secuencias
                </button>
                <button @click="subVistaActiva = 'servicios'" :class="['flex-1 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all rounded-md cursor-pointer text-center', subVistaActiva === 'servicios' ? 'bg-white text-blue-800 shadow-2xs border border-slate-200/40' : 'text-slate-400 hover:text-slate-600']">
                  Servicios Usados (Canal)
                </button>
              </div>

              <div class="mt-4 flex-1 min-h-0">
                <div v-if="subVistaActiva === 'automatizaciones'" class="space-y-4 animate-fadeIn">
                  <div class="p-5 bg-slate-50 rounded-xl border border-slate-200/60 max-w-2xl">
                    <span class="font-black text-slate-900 text-xs block tracking-wide uppercase text-blue-900">Secuencias Automatizadas</span>
                    <p class="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium">Flujos estructurados del sistema según el estado del embudo comercial (Plan Liga Automation).</p>
                    
                    <div class="mt-4 flex flex-wrap items-center gap-2">
                      <span class="px-2.5 py-1 bg-pink-50 text-pink-700 border border-pink-200 text-[10px] font-bold rounded-md uppercase tracking-wider">
                        Trigger: Formulario Web
                      </span>
                      <span class="text-slate-400 text-xs font-bold">➔</span>
                      <span class="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded-md uppercase tracking-wider">
                        Acción: Notificación WhatsApp
                      </span>
                    </div>
                  </div>
                </div>

                <div v-if="subVistaActiva === 'servicios'" class="space-y-4 animate-fadeIn max-w-3xl">
                  <div class="border border-slate-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                    <table class="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr class="bg-slate-50 text-slate-500 font-black uppercase text-[9px] border-b border-slate-200 tracking-wider">
                          <th class="p-3.5 pl-5">Línea de Servicio Institucional</th>
                          <th class="p-3.5 pr-5 text-right">Incidencia Global</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-slate-100 text-slate-700 font-semibold">
                        <tr class="hover:bg-slate-50/60 transition-colors">
                          <td class="p-3.5 pl-5 font-bold text-slate-900">Diseño de Sonrisa Mockup</td>
                          <td class="p-3.5 pr-5 text-right"><span class="px-2.5 py-0.5 bg-pink-50 text-pink-700 border border-pink-200 rounded-full text-[9px] font-black uppercase tracking-wider">Alta Demanda</span></td>
                        </tr>
                        <tr class="hover:bg-slate-50/60 transition-colors">
                          <td class="p-3.5 pl-5 font-bold text-slate-900">Profilaxis de Entrada</td>
                          <td class="p-3.5 pr-5 text-right"><span class="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-[9px] font-black uppercase tracking-wider">Frecuente</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="modoVista === 'particular' && contactoSeleccionado" class="flex-1 flex flex-col min-h-0 bg-white p-5 overflow-y-auto custom-scroll">
              <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                
                <div class="xl:col-span-2 space-y-5">
                  <div class="pb-3 border-b border-slate-200">
                    <span class="text-[9px] bg-pink-50 text-pink-700 border border-pink-200 font-black px-3 py-1 rounded-md uppercase tracking-widest inline-block shadow-2xs">
                      {{ contactoSeleccionado.estadoLead }}
                    </span>
                    <h2 class="text-xl font-black text-slate-900 tracking-tight mt-2.5">
                      {{ contactoSeleccionado.nombreCompleto }}
                    </h2>
                    <p class="text-[10px] font-mono text-slate-400 mt-1 tracking-wider uppercase font-bold">Código Único: {{ contactoSeleccionado.idUnico }}</p>
                  </div>

                  <div>
                    <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2.5 pb-1 border-b border-slate-100">Canales de Contactabilidad</h3>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <span class="text-slate-400 font-black block text-[9px] uppercase tracking-wider">Línea Móvil Directa</span>
                        <strong class="text-slate-800 font-mono text-xs block mt-1 font-bold">{{ contactoSeleccionado.telefono }}</strong>
                      </div>
                      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                        <span class="text-slate-400 font-black block text-[9px] uppercase tracking-wider">Enlace WhatsApp corporativo</span>
                        <strong class="text-slate-800 font-mono text-xs block mt-1 font-bold">{{ contactoSeleccionado.whatsapp }}</strong>
                      </div>
                      <div class="bg-slate-50 p-3 rounded-xl border border-slate-200/60 sm:col-span-2">
                        <span class="text-slate-400 font-black block text-[9px] uppercase tracking-wider">Correo Electrónico Validado</span>
                        <strong class="text-slate-800 text-xs block mt-1 truncate font-bold">{{ contactoSeleccionado.email }}</strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2.5 pb-1 border-b border-slate-100">Perfil Demográfico & Legal</h3>
                    <div class="grid grid-cols-2 gap-3 text-xs font-semibold">
                      <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-200/40">
                        <span class="text-slate-400 block text-[9px] uppercase tracking-wider">Sexo / Género</span>
                        <strong class="text-slate-800 block mt-0.5 font-bold">{{ contactoSeleccionado.genero }}</strong>
                      </div>
                      <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-200/40">
                        <span class="text-slate-400 block text-[9px] uppercase tracking-wider">Edad Cronológica</span>
                        <strong class="text-slate-800 block mt-0.5 font-mono font-bold">{{ contactoSeleccionado.edad }} años</strong>
                      </div>
                      <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-200/40">
                        <span class="text-slate-400 block text-[9px] uppercase tracking-wider">Identificación Legal</span>
                        <strong class="text-slate-800 block mt-0.5 font-mono font-bold">{{ contactoSeleccionado.tipoDocumento }} - {{ contactoSeleccionado.documento }}</strong>
                      </div>
                      <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-200/40">
                        <span class="text-slate-400 block text-[9px] uppercase tracking-wider">Ubicación Radicada</span>
                        <strong class="text-slate-800 block mt-0.5 font-bold">{{ contactoSeleccionado.ciudad }}, {{ contactoSeleccionado.pais }}</strong>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2.5 pb-1 border-b border-slate-100">Origen & Atribución Comercial</h3>
                    <div class="grid grid-cols-2 gap-3 text-xs font-semibold">
                      <div class="border border-slate-200 p-3 rounded-xl bg-slate-50/50">
                        <span class="text-slate-400 block text-[9px] font-black uppercase tracking-wider">Campaña de Entrada</span>
                        <strong class="text-slate-800 block mt-1 font-bold">{{ contactoSeleccionado.campana }}</strong>
                      </div>
                      <div class="border border-slate-200 p-3 rounded-xl bg-slate-50/50">
                        <span class="text-slate-400 block text-[9px] font-black uppercase tracking-wider">Medio / Canal Origen</span>
                        <strong class="text-slate-800 block mt-1 font-bold">{{ contactoSeleccionado.canalOrigen }}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="border-t xl:border-t-0 xl:border-l border-slate-200 pt-4 xl:pt-0 xl:pl-5 flex flex-col">
                  <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 pb-1 border-b border-slate-100">
                    Portafolio de Servicios
                  </h3>
                  
                  <div class="mb-3">
                    <input 
                      type="text" 
                      v-model="busquedaCriterioServicio" 
                      placeholder="Filtrar por servicio o fecha..." 
                      class="w-full bg-slate-50 text-slate-800 placeholder-slate-400 rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-600 transition-all shadow-inner" 
                    />
                  </div>
                  
                  <div class="overflow-y-auto max-h-[300px] space-y-2 pr-1 custom-scroll font-semibold">
                    <div v-for="(serv, idx) in serviciosHistoricosFiltrados" :key="idx" class="p-3 bg-white border border-slate-200/80 rounded-xl flex justify-between items-center text-xs shadow-2xs">
                      <div class="min-w-0">
                        <strong class="text-slate-900 block font-bold truncate tracking-tight">{{ serv.nombre }}</strong>
                        <span class="text-[9px] text-slate-400 font-mono block mt-0.5">Fecha: {{ serv.fecha }}</span>
                      </div>
                      <span :class="['text-[8px] px-2 py-0.5 rounded-md font-black uppercase border shrink-0 tracking-wider', serv.estado === 'Activo' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-500 border-slate-200']">
                        {{ serv.estado }}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <button @click="panelDerechoVisible = !panelDerechoVisible" class="bg-slate-200 text-slate-600 hover:bg-blue-700 hover:text-white w-4 h-12 self-center flex items-center justify-center rounded-l-md shadow-xs cursor-pointer z-40 shrink-0 transition-all border border-r-0 border-slate-300 -ml-3">
            <span class="text-[8px] font-black font-mono">{{ panelDerechoVisible ? '▶' : '◀' }}</span>
          </button>

          <section 
            :class="[
              'bg-white rounded-xl border border-slate-200/80 flex flex-col min-h-0 shadow-xs transition-all duration-300 relative shrink-0',
              panelDerechoVisible ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none border-none'
            ]"
          >
            <div class="flex border-b border-slate-200 bg-slate-50 rounded-t-xl overflow-hidden shrink-0 p-1 gap-1">
              <button 
                @click="subTabDerechoActivo = 'bitacora'" 
                :class="['flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all text-center rounded-lg cursor-pointer', subTabDerechoActivo === 'bitacora' ? 'bg-white text-pink-600 shadow-2xs border border-slate-200/40' : 'text-slate-400 hover:text-slate-600']"
              >
                Bitácora
              </button>
              <button 
                @click="subTabDerechoActivo = 'gestion'" 
                :class="['flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all text-center rounded-lg cursor-pointer', subTabDerechoActivo === 'gestion' ? 'bg-white text-blue-800 shadow-2xs border border-slate-200/40' : 'text-slate-400 hover:text-slate-600']"
              >
                Gestión Masiva
              </button>
            </div>
            
            <div v-if="contactoSeleccionado" class="p-3 space-y-4 text-xs overflow-y-auto flex-1 custom-scroll font-semibold">

            <!-- BITÁCORA -->
              <Bitacora
                v-if="subTabDerechoActivo === 'bitacora'"
                :contacto="contactoSeleccionado"
                @guardar="guardarNotaGestion"
              />

              <!-- GESTIÓN MASIVA -->
              <div v-else-if="subTabDerechoActivo === 'gestion'">
                <GestionMasiva
                  v-model:contacto="contactoSeleccionado"
                  @carga-excel="procesarArchivoExcelCargado"
                />
              </div>

            </div>
            
            <div v-else class="flex-1 flex items-center justify-center p-5 text-center text-slate-300 text-[10px] font-black uppercase tracking-widest leading-loose">
              Seleccione un registro<br>para agendar gestión.
            </div>
          </section>

        </div>

        <VincularBeneficiario 
          :is-open="isModalBeneficiarioOpen"
          :titular-nombre="contactoSeleccionado?.nombreCompleto || ''"
          :miembros-actuales="contactoSeleccionado ? calcularTotalMiembros(contactoSeleccionado) : 0"
          @close="isModalBeneficiarioOpen = false"
          @save="capturarYVincularBeneficiario"
        />
      </div>
    </template>

    <style scoped>
    .animate-fadeIn { animation: fadeIn 0.15s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(1px); } to { opacity: 1; transform: translateY(0); } }

    .custom-scroll::-webkit-scrollbar { width: 4px; }
    .custom-scroll::-webkit-scrollbar-track { background: #f1f5f9; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #fbcfe8; border-radius: 4px; }
    .custom-scroll::-webkit-scrollbar-thumb:hover { background: #f472b6; }
    </style>
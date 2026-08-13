import { ref, computed, watch } from 'vue'
import type { Empresa, EmpresaDraft, HistorialItem } from '../types/empresa'
import { getEmpresas, createEmpresa, updateEmpresa, deleteEmpresa, importarEmpresasPlanLiga } from '../services/empresas.api'
import { getContactos } from '@/features/contactos/services/contactos.api'
import { getActividades } from '@/features/relacionamiento/services/relacionamiento.api'
import { TIPO_META } from '@/features/relacionamiento/constants/relacionamiento.constants'

export function useEmpresas() {
  const empresas = ref<Empresa[]>([])
  const cargandoEmpresas = ref(false)
  const errorEmpresas = ref<string | null>(null)

  // El backend no expone el conteo de contactos por empresa: se deriva cruzando
  // GET /api/contactos/ (que ya trae empresaId por contacto) con el listado de empresas.
  const cargarEmpresas = async () => {
    cargandoEmpresas.value = true
    errorEmpresas.value = null
    try {
      const [listado, contactos] = await Promise.all([getEmpresas(), getContactos()])
      const conteoPorEmpresa = new Map<number, number>()
      for (const c of contactos) {
        if (c.empresaId === null) continue
        conteoPorEmpresa.set(c.empresaId, (conteoPorEmpresa.get(c.empresaId) ?? 0) + 1)
      }
      empresas.value = listado.map(e => ({ ...e, contactos: conteoPorEmpresa.get(e.id) ?? 0 }))
    } catch (e) {
      errorEmpresas.value = e instanceof Error ? e.message : 'No se pudo cargar el listado de empresas.'
    } finally {
      cargandoEmpresas.value = false
    }
  }

  const buscar = ref('')
  const filtroEstado = ref('todos')
  const filtroIndustria = ref('todas')

  const empresasFiltradas = computed(() =>
    empresas.value.filter(e => {
      const q = buscar.value.toLowerCase()
      const matchBuscar = !q || [e.razonSocial, e.nit, e.ciudad].some(f => f.toLowerCase().includes(q))
      const matchEstado = filtroEstado.value === 'todos'
        || (filtroEstado.value === 'Activa' ? e.estado : !e.estado)
      return matchBuscar
        && matchEstado
        && (filtroIndustria.value === 'todas' || e.industria === filtroIndustria.value)
    })
  )

  const industrias = computed(() => [...new Set(empresas.value.map(e => e.industria))].sort())

  // Paginado en cliente (6 por página): la tabla ya carga el catálogo completo para poder
  // buscar/filtrar en memoria, así que no hace falta ida y vuelta al backend para paginar.
  const POR_PAGINA = 6
  const paginaActual = ref(1)
  const totalPaginas = computed(() => Math.max(1, Math.ceil(empresasFiltradas.value.length / POR_PAGINA)))
  const hayPaginaAnterior = computed(() => paginaActual.value > 1)
  const hayPaginaSiguiente = computed(() => paginaActual.value < totalPaginas.value)
  const empresasPaginadas = computed(() => {
    const inicio = (paginaActual.value - 1) * POR_PAGINA
    return empresasFiltradas.value.slice(inicio, inicio + POR_PAGINA)
  })
  const paginaSiguiente = () => { if (hayPaginaSiguiente.value) paginaActual.value++ }
  const paginaAnterior = () => { if (hayPaginaAnterior.value) paginaActual.value-- }

  // Si cambian los filtros/búsqueda, o si la página actual queda fuera de rango (ej. se
  // borró una empresa y la última página ya no existe), vuelve a una página válida.
  watch([buscar, filtroEstado, filtroIndustria], () => { paginaActual.value = 1 })
  watch(totalPaginas, (total) => { if (paginaActual.value > total) paginaActual.value = total })

  const guardandoEmpresa = ref(false)
  const errorGuardarEmpresa = ref<string | null>(null)

  const crearEmpresa = async (data: EmpresaDraft): Promise<boolean> => {
    guardandoEmpresa.value = true
    errorGuardarEmpresa.value = null
    try {
      const nueva = await createEmpresa(data)
      empresas.value = [{ ...nueva, contactos: 0 }, ...empresas.value]
      return true
    } catch (e) {
      errorGuardarEmpresa.value = e instanceof Error ? e.message : 'No se pudo crear la empresa.'
      return false
    } finally {
      guardandoEmpresa.value = false
    }
  }

  const actualizarEmpresa = async (id: number, data: EmpresaDraft): Promise<boolean> => {
    guardandoEmpresa.value = true
    errorGuardarEmpresa.value = null
    try {
      const actualizada = await updateEmpresa(id, data)
      const idx = empresas.value.findIndex(e => e.id === id)
      if (idx !== -1) empresas.value[idx] = { ...actualizada, contactos: empresas.value[idx].contactos }
      return true
    } catch (e) {
      errorGuardarEmpresa.value = e instanceof Error ? e.message : 'No se pudo actualizar la empresa.'
      return false
    } finally {
      guardandoEmpresa.value = false
    }
  }

  const importandoPlanLiga = ref(false)
  const errorImportarPlanLiga = ref<string | null>(null)
  const resultadoImportarPlanLiga = ref<string | null>(null)

  const importarDesdePlanLiga = async () => {
    importandoPlanLiga.value = true
    errorImportarPlanLiga.value = null
    resultadoImportarPlanLiga.value = null
    try {
      const { creadas } = await importarEmpresasPlanLiga()
      resultadoImportarPlanLiga.value = creadas > 0
        ? `Se importaron ${creadas} empresa${creadas === 1 ? '' : 's'} nueva${creadas === 1 ? '' : 's'} desde Plan Liga.`
        : 'No hay empresas nuevas por importar desde Plan Liga.'
      await cargarEmpresas()
    } catch (e) {
      errorImportarPlanLiga.value = e instanceof Error ? e.message : 'No se pudo importar empresas desde Plan Liga.'
    } finally {
      importandoPlanLiga.value = false
    }
  }

  const eliminandoEmpresa = ref(false)
  const errorEliminarEmpresa = ref<string | null>(null)

  const eliminarEmpresa = async (id: number): Promise<boolean> => {
    eliminandoEmpresa.value = true
    errorEliminarEmpresa.value = null
    try {
      await deleteEmpresa(id)
      empresas.value = empresas.value.filter(e => e.id !== id)
      return true
    } catch (e) {
      errorEliminarEmpresa.value = e instanceof Error ? e.message : 'No se pudo eliminar la empresa.'
      return false
    } finally {
      eliminandoEmpresa.value = false
    }
  }

  // ─── Historial (últimas actividades de bitácora) de una empresa ────────────
  // El backend no expone un endpoint de bitácora por empresa (solo por contacto): se trae
  // la bitácora general y se filtra en el cliente por nombre_empresa, que es texto libre
  // pero coincide con razonSocial porque los diálogos de registro lo autocompletan así.
  const historialActual = ref<HistorialItem[]>([])
  const cargandoHistorial = ref(false)
  const errorHistorial = ref<string | null>(null)

  const cargarHistorial = async (empresa: Empresa) => {
    cargandoHistorial.value = true
    errorHistorial.value = null
    try {
      const todas = await getActividades()
      const nombre = empresa.razonSocial.trim().toLowerCase()
      historialActual.value = todas
        .filter(a => a.empresaNombre.trim().toLowerCase() === nombre)
        .map(a => ({
          tipo: a.tipo,
          desc: a.accion,
          fecha: a.fecha,
          usuario: a.usuario,
          icono: TIPO_META[a.tipo].icono,
          color: TIPO_META[a.tipo].color,
          bg: TIPO_META[a.tipo].bg,
        }))
    } catch (e) {
      errorHistorial.value = e instanceof Error ? e.message : 'No se pudo cargar el historial.'
      historialActual.value = []
    } finally {
      cargandoHistorial.value = false
    }
  }

  return {
    empresas, cargandoEmpresas, errorEmpresas, cargarEmpresas,
    buscar, filtroEstado, filtroIndustria,
    empresasFiltradas, industrias,
    paginaActual, totalPaginas, hayPaginaAnterior, hayPaginaSiguiente,
    empresasPaginadas, paginaSiguiente, paginaAnterior,
    crearEmpresa, actualizarEmpresa, guardandoEmpresa, errorGuardarEmpresa,
    eliminarEmpresa, eliminandoEmpresa, errorEliminarEmpresa,
    historialActual, cargandoHistorial, errorHistorial, cargarHistorial,
    importarDesdePlanLiga, importandoPlanLiga, errorImportarPlanLiga, resultadoImportarPlanLiga,
  }
}

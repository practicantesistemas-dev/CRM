import { ref, computed } from 'vue'
import type { Proveedor, ProveedorDraft } from '../types/proveedor'
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from '../services/proveedores.api'

export function useProveedores() {
  const proveedores = ref<Proveedor[]>([])
  const cargandoProveedores = ref(false)
  const errorProveedores = ref<string | null>(null)

  const cargarProveedores = async () => {
    cargandoProveedores.value = true
    errorProveedores.value = null
    try {
      proveedores.value = await getProveedores()
    } catch (e) {
      errorProveedores.value = e instanceof Error ? e.message : 'No se pudo cargar el listado de proveedores.'
    } finally {
      cargandoProveedores.value = false
    }
  }

  const buscar = ref('')
  const filtroEstado = ref('todos')
  const filtroCategoria = ref('todas')

  const proveedoresFiltrados = computed(() =>
    proveedores.value.filter(p => {
      const q = buscar.value.toLowerCase()
      const matchBuscar = !q || [p.nombre, p.nit, p.correo, p.categoria].some(f => f.toLowerCase().includes(q))
      return matchBuscar
        && (filtroEstado.value === 'todos' || p.estado === filtroEstado.value)
        && (filtroCategoria.value === 'todas' || p.categoria === filtroCategoria.value)
    })
  )

  const categorias = computed(() => [...new Set(proveedores.value.map(p => p.categoria))].sort())

  const guardandoProveedor = ref(false)
  const errorGuardarProveedor = ref<string | null>(null)

  const crearProveedor = async (data: ProveedorDraft): Promise<boolean> => {
    guardandoProveedor.value = true
    errorGuardarProveedor.value = null
    try {
      const nuevo = await createProveedor(data)
      proveedores.value = [nuevo, ...proveedores.value]
      return true
    } catch (e) {
      errorGuardarProveedor.value = e instanceof Error ? e.message : 'No se pudo crear el proveedor.'
      return false
    } finally {
      guardandoProveedor.value = false
    }
  }

  const actualizarProveedor = async (id: number, data: ProveedorDraft): Promise<boolean> => {
    guardandoProveedor.value = true
    errorGuardarProveedor.value = null
    try {
      const actualizado = await updateProveedor(id, data)
      const idx = proveedores.value.findIndex(p => p.id === id)
      if (idx !== -1) proveedores.value[idx] = actualizado
      return true
    } catch (e) {
      errorGuardarProveedor.value = e instanceof Error ? e.message : 'No se pudo actualizar el proveedor.'
      return false
    } finally {
      guardandoProveedor.value = false
    }
  }

  const eliminandoProveedor = ref(false)
  const errorEliminarProveedor = ref<string | null>(null)

  const eliminarProveedor = async (id: number): Promise<boolean> => {
    eliminandoProveedor.value = true
    errorEliminarProveedor.value = null
    try {
      await deleteProveedor(id)
      proveedores.value = proveedores.value.filter(p => p.id !== id)
      return true
    } catch (e) {
      errorEliminarProveedor.value = e instanceof Error ? e.message : 'No se pudo eliminar el proveedor.'
      return false
    } finally {
      eliminandoProveedor.value = false
    }
  }

  return {
    proveedores, cargandoProveedores, errorProveedores, cargarProveedores,
    buscar, filtroEstado, filtroCategoria,
    proveedoresFiltrados, categorias,
    crearProveedor, actualizarProveedor, guardandoProveedor, errorGuardarProveedor,
    eliminarProveedor, eliminandoProveedor, errorEliminarProveedor,
  }
}

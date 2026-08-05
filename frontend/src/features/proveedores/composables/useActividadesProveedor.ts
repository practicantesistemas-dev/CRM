import { ref } from 'vue'
import type { ActividadServicio, ActividadServicioDraft } from '../types/actividadServicio'
import {
  getActividadesProveedor, crearActividadProveedor, actualizarActividadProveedor, eliminarActividadProveedor,
} from '../services/actividadesProveedor.api'

export function useActividadesProveedor() {
  const actividades = ref<ActividadServicio[]>([])
  const cargando = ref(false)
  const error = ref<string | null>(null)

  // Sin búsqueda activa se muestran solo las 4 más recientes (mismo patrón que el historial
  // de contactos); al buscar se levanta el límite para cubrir todas las actividades del
  // proveedor, no solo esas 4.
  const cargar = async (proveedorId: number, q?: string) => {
    cargando.value = true
    error.value = null
    try {
      actividades.value = await getActividadesProveedor(proveedorId, { q, limit: q ? 200 : 4 })
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'No se pudo cargar las actividades del proveedor.'
    } finally {
      cargando.value = false
    }
  }

  const guardando = ref(false)
  const errorGuardar = ref<string | null>(null)

  const crear = async (data: ActividadServicioDraft): Promise<boolean> => {
    guardando.value = true
    errorGuardar.value = null
    try {
      const nueva = await crearActividadProveedor(data)
      actividades.value = [nueva, ...actividades.value]
      return true
    } catch (e) {
      errorGuardar.value = e instanceof Error ? e.message : 'No se pudo crear la actividad.'
      return false
    } finally {
      guardando.value = false
    }
  }

  const actualizar = async (id: number, data: ActividadServicioDraft): Promise<boolean> => {
    guardando.value = true
    errorGuardar.value = null
    try {
      const actualizada = await actualizarActividadProveedor(id, data)
      const idx = actividades.value.findIndex(a => a.id === id)
      if (idx !== -1) actividades.value[idx] = actualizada
      return true
    } catch (e) {
      errorGuardar.value = e instanceof Error ? e.message : 'No se pudo actualizar la actividad.'
      return false
    } finally {
      guardando.value = false
    }
  }

  const eliminando = ref(false)
  const errorEliminar = ref<string | null>(null)

  const eliminar = async (id: number): Promise<boolean> => {
    eliminando.value = true
    errorEliminar.value = null
    try {
      await eliminarActividadProveedor(id)
      actividades.value = actividades.value.filter(a => a.id !== id)
      return true
    } catch (e) {
      errorEliminar.value = e instanceof Error ? e.message : 'No se pudo eliminar la actividad.'
      return false
    } finally {
      eliminando.value = false
    }
  }

  return {
    actividades, cargando, error, cargar,
    crear, actualizar, guardando, errorGuardar,
    eliminar, eliminando, errorEliminar,
  }
}

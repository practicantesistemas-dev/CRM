import { ref, computed } from 'vue'
import type { Proveedor, ProveedorDraft } from '../types/proveedor'
import { getProveedores, createProveedor, updateProveedor } from '../services/proveedores.api'

export function useProveedores() {
  const proveedores = ref<Proveedor[]>(getProveedores())

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

  const crearProveedor = (data: ProveedorDraft) => {
    proveedores.value = [createProveedor(data), ...proveedores.value]
  }

  const actualizarProveedor = (id: number, data: ProveedorDraft) => {
    const actualizado = updateProveedor(id, data)
    if (!actualizado) return
    const idx = proveedores.value.findIndex(p => p.id === id)
    if (idx !== -1) proveedores.value[idx] = actualizado
  }

  return {
    proveedores, buscar, filtroEstado, filtroCategoria,
    proveedoresFiltrados, categorias,
    crearProveedor, actualizarProveedor,
  }
}

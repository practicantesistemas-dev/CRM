import { ref, computed } from 'vue'
import type { Empresa, EmpresaDraft } from '../types/empresa'
import { getEmpresas, createEmpresa, updateEmpresa } from '../services/empresas.api'

export function useEmpresas() {
  const empresas = ref<Empresa[]>(getEmpresas())

  const buscar = ref('')
  const filtroEstado = ref('todos')
  const filtroIndustria = ref('todas')

  const empresasFiltradas = computed(() =>
    empresas.value.filter(e => {
      const q = buscar.value.toLowerCase()
      const matchBuscar = !q || [e.razonSocial, e.nit, e.ciudad].some(f => f.toLowerCase().includes(q))
      return matchBuscar
        && (filtroEstado.value === 'todos' || e.estado === filtroEstado.value)
        && (filtroIndustria.value === 'todas' || e.industria === filtroIndustria.value)
    })
  )

  const industrias = computed(() => [...new Set(empresas.value.map(e => e.industria))].sort())

  const crearEmpresa = (data: EmpresaDraft) => {
    empresas.value = [createEmpresa(data), ...empresas.value]
  }

  const actualizarEmpresa = (id: number, data: EmpresaDraft) => {
    const actualizada = updateEmpresa(id, data)
    if (!actualizada) return
    const idx = empresas.value.findIndex(e => e.id === id)
    if (idx !== -1) empresas.value[idx] = actualizada
  }

  return {
    empresas, buscar, filtroEstado, filtroIndustria,
    empresasFiltradas, industrias,
    crearEmpresa, actualizarEmpresa,
  }
}

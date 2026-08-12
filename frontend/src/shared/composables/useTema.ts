import { computed, ref, watch } from 'vue'

type Tema = 'claro' | 'oscuro'

const STORAGE_KEY = 'crm-tema'

function temaGuardado(): Tema {
  return localStorage.getItem(STORAGE_KEY) === 'oscuro' ? 'oscuro' : 'claro'
}

// El toggle es manual (el usuario lo elige en el menu de arriba), no sigue
// el tema del sistema operativo.
function aplicarTema(valor: Tema) {
  document.documentElement.classList.toggle('dark', valor === 'oscuro')
  document.documentElement.style.colorScheme = valor === 'oscuro' ? 'dark' : 'light'
}

const tema = ref<Tema>(temaGuardado())
aplicarTema(tema.value)

watch(tema, (valor) => {
  localStorage.setItem(STORAGE_KEY, valor)
  aplicarTema(valor)
})

export function useTema() {
  const esOscuro = computed(() => tema.value === 'oscuro')
  const alternarTema = () => {
    tema.value = tema.value === 'oscuro' ? 'claro' : 'oscuro'
  }
  return { tema, esOscuro, alternarTema }
}

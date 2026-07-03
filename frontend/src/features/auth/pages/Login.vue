<template>
  <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row antialiased text-slate-800 font-sans w-full overflow-hidden">
    
    <div class="w-full md:w-1/2 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 p-8 flex flex-col justify-between relative overflow-hidden text-white min-h-[40vh] md:min-h-screen">
      <div class="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="flex items-center gap-3 relative z-10">
        <div class="bg-white p-1.5 rounded-xl shadow-md">
          <span class="text-blue-700 font-black text-sm tracking-tight">PL</span>
        </div>
        <div>
          <span class="text-[9px] text-blue-200 block font-bold uppercase tracking-wider leading-none">Plataforma Institucional</span>
          <h1 class="text-sm font-black tracking-tight text-white uppercase leading-tight">Mercadeo</h1>
        </div>
      </div>

      <div class="my-auto max-w-md space-y-6 relative z-10 pt-8 md:pt-0">
        <div class="inline-flex items-center gap-2 bg-blue-600/40 border border-blue-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-pink-300">
          🎗️ 50 Años Salvando Vidas
        </div>
        <h2 class="text-3xl md:text-4xl font-black tracking-tight leading-tight">
          Bienvenido a la <br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-white to-amber-300">
            Consola Centralizada
          </span>
        </h2>
        <p class="text-xs md:text-sm text-blue-100 leading-relaxed font-medium">
          Accede al ecosistema comercial para maximizar nuestro impacto .
        </p>
      </div>

      <div class="text-[10px] text-blue-300/80 font-medium flex justify-between items-center relative z-10 pt-4 border-t border-blue-600/40">
        <span>© 2026 Fundación La Liga.</span>
        <span class="font-mono">v3.5.0</span>
      </div>
    </div>

    <div class="w-full md:w-1/2 bg-white flex items-center justify-center p-6 sm:p-12 md:p-16 relative">
      <div class="w-full max-w-sm space-y-8 animate-fadeIn">
        
        <div class="text-center md:text-left space-y-4">
          <div class="flex justify-center md:justify-start">
            <img 
              src="/logo-liga-50.png" 
              alt="Fundación La Liga - 50 Años" 
              class="w-full max-w-[290px] h-auto object-contain select-none pointer-events-none"
            />
          </div>
          
          <div class="pt-2">
            <h3 class="text-lg font-black text-slate-900 tracking-tight">Iniciar Sesión</h3>
            <p class="text-xs text-slate-400 mt-1">Ingresa tus credenciales autorizadas por TI.</p>
          </div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Usuario o Correo</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 text-xs pointer-events-none"></span>
              <input 
                v-model="form.username" 
                type="text" 
                required
                placeholder="ejemplo@laliga.org" 
                class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200/80 pl-9 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-2xs" 
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="flex justify-between items-center">
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Contraseña</label>
              <a href="#" class="text-[10px] font-bold text-pink-500 hover:underline">¿La olvidaste?</a>
            </div>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 text-xs pointer-events-none"></span>
              <input 
                v-model="form.password" 
                type="password" 
                required
                placeholder="••••••••••••" 
                class="w-full bg-slate-50 text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200/80 pl-9 pr-4 py-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all shadow-2xs" 
              />
            </div>
          </div>

          <div class="flex items-center justify-between pt-1">
            <label class="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" v-model="form.rememberMe" class="w-3.5 h-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 bg-slate-50" />
              <span class="text-[11px] text-slate-500 font-medium">Recordar sesión</span>
            </label>
          </div>

          <div v-if="errorMsg" class="p-2.5 bg-red-50 border border-red-100 rounded-xl text-[11px] font-semibold text-red-600 flex items-center gap-2 animate-fadeIn">
            <span>⚠️</span> {{ errorMsg }}
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full bg-gradient-to-r from-blue-700 to-blue-800 hover:from-pink-500 hover:to-pink-600 text-white font-black text-xs uppercase tracking-widest py-3 rounded-xl shadow-md shadow-blue-700/10 hover:shadow-pink-500/10 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-center flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full"></span>
            {{ loading ? 'Autenticando...' : 'Acceder ' }}
          </button>
        </form>

        <div class="pt-4 border-t border-slate-100 text-center">
          <p class="text-[10px] text-slate-400 font-medium">
            ¿Problemas de acceso? Contacta a <a href="mailto:soporte@fundacionlaliga.org" class="text-blue-600 font-bold hover:underline">Soporte TI</a>
          </p>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const loading = ref<boolean>(false)
const errorMsg = ref<string>('')

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
})

const handleLogin = () => {
  loading.value = true
  errorMsg.value = ''

  setTimeout(() => {
    loading.value = false
    if (form.username && form.password) {
      alert(`Autenticación Exitosa para el Plan Liga.`);
      login()
      router.push('/dashboard')
    } else {
      errorMsg.value = 'Credenciales inválidas o cuenta no activa en consola.'
    }
  }, 1200)
}
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
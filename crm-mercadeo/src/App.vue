<template>
  <LoginView v-if="!usuarioAutenticado" @login-success="conectarUsuario" />

  <CRMMercadeoView v-else @logout="desconectarUsuario" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
// Importaciones apuntando exactamente a tu carpeta modules/leads/views/
import LoginView from './modules/leads/views/Login.view.vue'
import CRMMercadeoView from './modules/leads/views/CRM_MercadeoView.vue'

// Estado global temporal de sesión
const usuarioAutenticado = ref<boolean>(false)

const conectarUsuario = () => {
  usuarioAutenticado.value = true
}

const desconectarUsuario = () => {
  usuarioAutenticado.value = false
}
</script>
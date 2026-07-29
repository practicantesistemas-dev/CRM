<script setup lang="ts">
import { useAuth } from '@/features/auth/composables/useAuth'
const { me } = useAuth()
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-[20px] font-bold text-[#0F172A]">Mi cuenta</h1>
    <div class="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-[13px]">
      <div><span class="text-slate-400 font-semibold">Nombre:</span> {{ me?.nombres }}</div>
      <div><span class="text-slate-400 font-semibold">Usuario:</span> {{ me?.username }}</div>
      <div><span class="text-slate-400 font-semibold">Correo:</span> {{ me?.email }}</div>
      <div><span class="text-slate-400 font-semibold">Rol:</span> {{ me?.portal_role }}</div>
      <div><span class="text-slate-400 font-semibold">Área:</span> {{ me?.area_name }}</div>
    </div>
  </div>
</template>


<template>
  <div v-if="contactoLocal" class="space-y-4">

    <!-- KPIs -->   
    <div class="grid grid-cols-2 gap-2 text-center">
      <div class="bg-slate-50 border p-2.5 rounded-xl">
        <span class="font-black text-base">
          {{ contactoLocal.cantidadLlamadas }}
        </span>

        <span class="text-[8px] uppercase block">
          Llamadas
        </span>
      </div>

      <div class="bg-slate-50 border p-2.5 rounded-xl">
        <span class="font-black text-base">
          {{ contactoLocal.cantidadEmails }}
        </span>

        <span class="text-[8px] uppercase block">
          Emails
        </span>
      </div>
    </div>

    <!-- Próximo seguimiento -->
    <div>
      <label class="text-[9px] font-black uppercase">
        Próximo seguimiento
      </label>

      <input
        type="date"
        v-model="contactoLocal.proximoContacto"
        class="w-full border p-2 rounded-lg text-xs"
      />
    </div>

    <!-- AGREGAR SEGUIMIENTO -->
    <div class="border-t pt-3 space-y-2">

      <label class="text-[9px] font-black uppercase">
        Agregar seguimiento
      </label>

      <!-- LISTA DESPLEGABLE -->
      <select
        v-model="nuevoSeguimiento.tipo"
        class="w-full border p-2 rounded-lg text-xs"
      >
        <option value="llamada">Llamada</option>
        <option value="correo">Correo</option>
        <option value="whatsapp">WhatsApp</option>
        <option value="visita">Visita</option>
        <option value="nota">Nota</option>
      </select>

      <!-- FECHA -->
      <input
        type="date"
        v-model="nuevoSeguimiento.fecha"
        class="w-full border p-2 rounded-lg text-xs"
      />

      <!-- HORA -->
      <input
        type="time"
        v-model="nuevoSeguimiento.hora"
        class="w-full border p-2 rounded-lg text-xs"
      />

      <!-- DESCRIPCIÓN -->
      <textarea
        v-model="nuevoSeguimiento.descripcion"
        rows="3"
        placeholder="Descripción..."
        class="w-full border p-2 rounded-lg text-xs"
      />

      <button
        @click="agregarSeguimiento"
        class="w-full bg-blue-700 text-white py-2 text-[10px] font-black uppercase rounded-lg"
      >
        + Agregar Seguimiento
      </button>
    </div>

    <!-- HISTORIAL -->
    <div
      v-if="contactoLocal.seguimientos?.length"
      class="space-y-2"
    >
      <label class="text-[9px] font-black uppercase">
        Historial
      </label>

      <div
        v-for="(s, i) in contactoLocal.seguimientos"
        :key="i"
        class="p-2 bg-slate-50 border rounded-lg text-xs"
      >
        <div class="flex justify-between text-[9px] text-slate-400">
          <span>
            {{ s.fecha }} - {{ s.hora }}
          </span>

          <span class="uppercase font-black">
            {{ s.tipo }}
          </span>
        </div>

        <div class="mt-1 text-slate-700">
          {{ s.descripcion }}
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Seguimiento {
  fecha: string
  hora: string
  tipo: string
  descripcion: string
}

interface Contacto {
  cantidadLlamadas: number
  cantidadEmails: number
  proximoContacto: string
  seguimientos?: Seguimiento[]
}

const props = defineProps<{
  contacto: Contacto | null
}>()

const contactoLocal = computed(() => props.contacto)

const nuevoSeguimiento = ref<Seguimiento>({
  fecha: '',
  hora: '',
  tipo: 'llamada',
  descripcion: ''
})

const agregarSeguimiento = () => {
  if (!contactoLocal.value) return

  if (!contactoLocal.value.seguimientos) {
    contactoLocal.value.seguimientos = []
  }

  contactoLocal.value.seguimientos.push({
    ...nuevoSeguimiento.value
  })

  nuevoSeguimiento.value = {
    fecha: '',
    hora: '',
    tipo: 'llamada',
    descripcion: ''
  }
}
</script>


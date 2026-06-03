<template>
  <div class="w-full h-[85vh] min-h-[600px] border border-gray-200 rounded-xl overflow-hidden shadow-lg bg-white">
    
    <tableau-viz 
      id="tableauViz"
      :src="dashboardUrl"
      toolbar="hidden"
      hide-tabs
      class="w-full h-full">
    </tableau-viz>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const dashboardUrl = ref("https://us-east-1.online.tableau.com/t/laliga-amasalvarvidas/views/Ordenamiento-GestionOrdenamiento/Inicio-Informe-GestionOrdenamiento");

onMounted(() => {
  // Inyectamos la librería de Tableau solo si no existe
  if (!document.getElementById('tableau-env')) {
    const script = document.createElement('script');
    script.type = 'module';
    script.id = 'tableau-env';
    script.src = 'https://us-east-1.online.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
    document.head.appendChild(script);
  }
});
</script>
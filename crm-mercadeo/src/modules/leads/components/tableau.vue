<template>
  <div class="tableau-container">
    <tableau-viz 
      v-if="jwtToken"
      id="tableau-viz"
      src="https://us-east-1.online.tableau.com/t/laliga-amasalvarvidas/views/Produccion-PlanLigaUso/Inicio-Informe-PlanLigaUso"
      :token="jwtToken"
      width="100%"
      height="1018"
      toolbar="bottom"
    >
    </tableau-viz>
    
    <div v-else class="flex justify-center items-center h-[600px] text-slate-500 font-bold">
      Autenticando tablero de forma segura...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import '@tableau/embedding-api';
import { SignJWT } from 'jose';

const jwtToken = ref(null);

const clientId = import.meta.env.VITE_TABLEAU_CLIENT_ID;
const secretId = import.meta.env.VITE_TABLEAU_SECRET_ID;
const secretValue = import.meta.env.VITE_TABLEAU_SECRET_VALUE;
const username = import.meta.env.VITE_TABLEAU_USERNAME;

const generarToken = async () => {
  try {
    const secret = new TextEncoder().encode(secretValue);
    
    const ahora = Math.floor(Date.now() / 1000) - 60; 

    const token = await new SignJWT({
      iss: clientId,
      sub: username,
      aud: 'tableau',
      scp: ['tableau:views:embed', 'tableau:metrics:embed'] 
    })
      .setProtectedHeader({ 
        alg: 'HS256',
        kid: secretId, 
        iss: clientId  
      })
      .setJti(crypto.randomUUID())
      .setIssuedAt(ahora) 
      .setExpirationTime(ahora + 300) 
      .sign(secret);

    return token;
  } catch (error) {
    console.error('Error al generar token:', error);
    return null;
  }
};

onMounted(async () => {
  const tokenGenerado = await generarToken();
  if (tokenGenerado) {
    jwtToken.value = tokenGenerado;
  }
});
</script>

<style scoped>
.tableau-container {
  width: 100%;
}
</style>
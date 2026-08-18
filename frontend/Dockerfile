# ---- Build ----
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Se hornean en el bundle estático (Vite los resuelve en build time, no en runtime).
# VITE_CRM_API_URL se deja vacío a propósito: el nginx de este mismo contenedor
# proxea /api hacia el backend (ver nginx.conf), así el frontend llama rutas relativas
# same-origin y no hace falta CORS ni hardcodear IP/puerto del backend.
ARG VITE_CRM_API_URL=""
ARG VITE_PORTAL_PRINCIPAL_URL=""
ARG VITE_TABLEAU_CLIENT_ID=""
ARG VITE_TABLEAU_SECRET_ID=""
ARG VITE_TABLEAU_SECRET_VALUE=""
ARG VITE_TABLEAU_USERNAME=""
ENV VITE_CRM_API_URL=$VITE_CRM_API_URL \
    VITE_PORTAL_PRINCIPAL_URL=$VITE_PORTAL_PRINCIPAL_URL \
    VITE_TABLEAU_CLIENT_ID=$VITE_TABLEAU_CLIENT_ID \
    VITE_TABLEAU_SECRET_ID=$VITE_TABLEAU_SECRET_ID \
    VITE_TABLEAU_SECRET_VALUE=$VITE_TABLEAU_SECRET_VALUE \
    VITE_TABLEAU_USERNAME=$VITE_TABLEAU_USERNAME

RUN npm run build

# ---- Runtime ----
FROM nginx:1.27-alpine AS runtime
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

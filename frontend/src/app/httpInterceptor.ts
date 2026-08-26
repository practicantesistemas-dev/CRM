import { useAuth } from '@/features/auth/composables/useAuth'

const API_URLS = [import.meta.env.VITE_CRM_API_URL, import.meta.env.VITE_PORTAL_PRINCIPAL_URL].filter(
  Boolean,
)

function urlDeLaPeticion(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.href
  return input.url
}

let yaRedirigiendo = false

// Envuelve el fetch global: si cualquier llamada a nuestra API responde 401,
// la sesion local ya no sirve (token vencido, o el backend la invalido
// porque le cambiaron el rol al usuario - ver get_current_username en
// app/core/dependencies.py del backend) asi que cierra sesion y manda a
// /login en vez de dejar la pantalla mostrando datos a medias o errores
// sueltos por cada peticion fallida.
export function installHttpInterceptor(): void {
  const fetchOriginal = window.fetch.bind(window)

  window.fetch = async (...args: Parameters<typeof fetch>) => {
    const response = await fetchOriginal(...args)

    const url = urlDeLaPeticion(args[0])
    const esApiPropia = API_URLS.some((base) => url.startsWith(base))
    const esLogin = url.includes('/auth/login')
    // /auth/me la usa fetchMe() para refrescar datos "best effort" (ver
    // useAuth.ts: si falla, se queda con lo último conocido y no revienta
    // nada) - la usa tambien el router para chequear si a alguien sin rol
    // ya se lo asignaron. Si esta llamada puntual devuelve 403 "sin rol"
    // (porque todavia no le asignan nada) NO debe forzar un logout: el
    // router es quien decide a donde mandarlo en ese caso (ver
    // router/index.ts). El logout automatico es solo para acciones reales
    // del usuario contra otros endpoints.
    const esAuthMe = url.includes('/auth/me')

    if (esApiPropia && !esLogin && !esAuthMe && !yaRedirigiendo) {
      if (response.status === 401) {
        cerrarSesionYRedirigir()
      } else if (response.status === 403 && (await esSinRolAsignado(response))) {
        // Estaba adentro con un rol valido y se lo quitaron a mitad de
        // sesion: el navegador todavia no lo sabe (el login no se repite
        // solo), asi que la primera peticion que falla con este 403
        // puntual es la señal de sacarlo - a diferencia de "sin rol" en el
        // login, aqui no tiene sentido mostrarle la pantalla informativa,
        // se manda directo a /login (ver router/index.ts para el otro caso).
        cerrarSesionYRedirigir()
      }
    }

    return response
  }
}

function cerrarSesionYRedirigir(): void {
  yaRedirigiendo = true
  useAuth().logout()
  window.location.href = '/login'
}

// Distingue el 403 de "ya no tiene rol" de otros 403 de reglas de negocio
// (ej. "ese rol no se puede asignar") que no deben cerrar la sesion.
async function esSinRolAsignado(response: Response): Promise<boolean> {
  const body = await response
    .clone()
    .json()
    .catch(() => null)
  return typeof body?.detail === 'string' && body.detail.includes('no tiene un rol asignado')
}

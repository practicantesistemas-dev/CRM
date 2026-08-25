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

    if (response.status === 401 && esApiPropia && !esLogin && !yaRedirigiendo) {
      yaRedirigiendo = true
      useAuth().logout()
      window.location.href = '/login'
    }

    return response
  }
}

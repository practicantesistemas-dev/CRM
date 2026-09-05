// Plantilla de correo HTML editable con el editor visual (GrapesJS).
// Por ahora se guarda solo en el navegador (localStorage), sin backend.
export interface Plantilla {
  id: string
  nombre: string
  asunto: string
  /** HTML final del correo, con el <style> embebido — listo para enviar o descargar. */
  html: string
  /** CSS que genera GrapesJS aparte (se guarda para poder re-editar sin perder estilos). */
  css: string
  /** Estado interno de GrapesJS (editor.getProjectData) para reabrir la plantilla tal cual quedó. */
  proyecto: unknown
  creadoEn: string
  actualizadoEn: string
}

export type PlantillaDraft = Pick<Plantilla, 'nombre' | 'asunto' | 'html' | 'css' | 'proyecto'>

// Grupo de correos guardado para reutilizarlo al enviar (también solo en el navegador).
export interface GrupoCorreos {
  id: string
  nombre: string
  correos: string[]
}

export interface ResultadoEnvioPlantilla {
  plantilla: string
  asunto: string
  destinatarios: string[]
  fecha: string
}

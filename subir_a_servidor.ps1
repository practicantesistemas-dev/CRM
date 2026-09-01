<#
  Sube la carpeta CRM completa a la carpeta compartida del servidor, lo mas rapido
  posible segun la capacidad de esta maquina (robocopy multihilo, un hilo por cada
  procesador logico que tenga el equipo, hasta el maximo que soporta robocopy).

  El destino queda como <CARPETA_BASE>\CRM (el nombre CRM se toma solo del nombre
  de esta carpeta, no hay que escribirlo).

  Copia en modo ESPEJO (/MIR): lo que se borro o se movio de sitio localmente
  tambien se borra en el servidor, para que no queden archivos viejos sueltos
  (ej. tras mover una vista de un modulo a otro). Las carpetas que el servidor
  regenera solo (node_modules, venv, .git, cache, builds) se excluyen tanto de
  la copia como del borrado, asi que /MIR NO las toca alla.

  Los .env SI se suben (el servidor los necesita para arrancar con la config
  real): lo que este en el .env local al momento de correr esto es lo que queda
  en el servidor -> revisa que apunte a la base correcta antes de subir.

  Solo se ejecuta cuando TU lo corres a mano - no hay nada programado ni automatico.
  Uso: clic derecho sobre este archivo -> "Ejecutar con PowerShell",
       o desde una terminal parado en esta carpeta: .\subir_a_servidor.ps1
#>

$origen = $PSScriptRoot
$base   = "\\160.1.1.230\Sistemas\Juan David\APLICACIONES_SERVIDOR_160.2.1.22"
$destino = Join-Path $base (Split-Path $origen -Leaf)   # -> ...\APLICACIONES_SERVIDOR_160.2.1.22\CRM

# Hilos de copia = numero de procesadores logicos de esta maquina (32 es el tope que
# soporta robocopy): a mas nucleos, mas rapido sube, sin tener que ajustarlo a mano.
$hilos = [Math]::Min([Environment]::ProcessorCount, 32)

Write-Host "Origen : $origen"
Write-Host "Destino: $destino"
Write-Host "Hilos  : $hilos"
Write-Host ""

# La carpeta base compartida tiene que estar accesible (VPN / red / permisos).
if (-not (Test-Path $base)) {
    Write-Host "No se puede acceder a la carpeta base:" -ForegroundColor Red
    Write-Host "  $base" -ForegroundColor Red
    Write-Host "Verifica la red / VPN y que tengas permiso de escritura, e intenta de nuevo." -ForegroundColor Red
    exit 1
}

robocopy $origen $destino /MIR /MT:$hilos /R:2 /W:5 `
  /XD node_modules venv .venv .git __pycache__ dist build .vite `
  /XF *.pyc *.log `
  /NFL /NDL

$codigo = $LASTEXITCODE
if ($codigo -lt 8) {
    Write-Host ""
    Write-Host "Listo, subida completa (codigo robocopy: $codigo)." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Hubo errores en la copia (codigo robocopy: $codigo). Revisa el detalle de arriba." -ForegroundColor Red
}

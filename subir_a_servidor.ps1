<#
  Sube la carpeta CRM completa a la carpeta compartida del servidor, lo mas rapido
  posible segun la capacidad de esta maquina (robocopy multihilo, un hilo por cada
  procesador logico que tenga el equipo, hasta el maximo que soporta robocopy).

  Excluye solo lo que el servidor no necesita porque se regenera solo (node_modules,
  venv, .git, cache de Python, builds viejos) - los .env SI se suben, porque el
  servidor los necesita para arrancar con la configuracion real.

  Solo se ejecuta cuando TU lo corres a mano - no hay nada programado ni automatico.
  Uso: clic derecho sobre este archivo -> "Ejecutar con PowerShell",
       o desde una terminal parado en esta carpeta: .\subir_a_servidor.ps1
#>

$origen  = $PSScriptRoot
$destino = "\\160.1.1.230\Sistemas\Juan David\APLICACIONES_SERVIDOR_160.2.1.22\CRM"

# Hilos de copia = numero de procesadores logicos de esta maquina (32 es el tope que
# soporta robocopy): a mas nucleos, mas rapido sube, sin tener que ajustarlo a mano.
$hilos = [Math]::Min([Environment]::ProcessorCount, 32)

Write-Host "Origen : $origen"
Write-Host "Destino: $destino"
Write-Host "Hilos  : $hilos"
Write-Host ""

robocopy $origen $destino /E /MT:$hilos /R:2 /W:5 `
  /XD node_modules venv .git __pycache__ dist build `
  /XF *.pyc `
  /NFL /NDL

$codigo = $LASTEXITCODE
if ($codigo -lt 8) {
    Write-Host ""
    Write-Host "Listo, subida completa (codigo robocopy: $codigo)." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Hubo errores en la copia (codigo robocopy: $codigo). Revisa el detalle de arriba." -ForegroundColor Red
}

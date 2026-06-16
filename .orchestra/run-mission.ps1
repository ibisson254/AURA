# run-mission.ps1 — Orquestra a fase de audit de uma missão
# Uso: .\.orchestra\run-mission.ps1 -Mission "nome-da-missao"
#
# O que faz:
# 1. Roda pre-flight (snapshot + tag)
# 2. Confirma que mission.md existe e foi preenchido pelo Claude
# 3. Abre mission.md para o Antigravity ler
# 4. Aguarda o Antigravity preencher report.md
# 5. Copia report.md para o clipboard (pronto para colar no Claude)

param(
    [Parameter(Mandatory=$true)]
    [string]$Mission
)

$orchestraDir = $PSScriptRoot
$missionFile = Join-Path $orchestraDir "mission.md"
$reportFile = Join-Path $orchestraDir "report.md"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ORCHESTRA — Fase de Audit" -ForegroundColor Cyan
Write-Host "  Missão: $Mission" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Pre-flight
Write-Host "[1/4] Executando pre-flight..." -ForegroundColor Yellow
& "$orchestraDir\pre-flight.ps1" -Mission $Mission
Write-Host ""

# 2. Verificar mission.md
if (-not (Test-Path $missionFile)) {
    Write-Host "[ERRO] mission.md não encontrado em $orchestraDir" -ForegroundColor Red
    Write-Host "Peça ao Claude para gerar a missão e salve em: $missionFile" -ForegroundColor Yellow
    exit 1
}

$missionContent = Get-Content $missionFile -Raw
if ($missionContent -match "\[NOME_DA_MISSÃO\]") {
    Write-Host "[WARN] mission.md parece ser o template vazio." -ForegroundColor Yellow
    Write-Host "Confirme que o Claude preencheu o conteúdo real da missão." -ForegroundColor Yellow
    $proceed = Read-Host "Continuar mesmo assim? (S/N)"
    if ($proceed -ne "S") { exit 0 }
}

Write-Host "[2/4] mission.md encontrado. Pronto para o Antigravity." -ForegroundColor Green
Write-Host ""

# 3. Instruir o utilizador
Write-Host "[3/4] PRÓXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "  a) O Antigravity deve ler:" -ForegroundColor White
Write-Host "     - AGENTS.md (regras)" -ForegroundColor Gray
Write-Host "     - CONVENTIONS.md (tokens)" -ForegroundColor Gray
Write-Host "     - .orchestra/mission.md (a missão)" -ForegroundColor Gray
Write-Host "  b) O Antigravity grava o resultado em:" -ForegroundColor White
Write-Host "     - .orchestra/report.md" -ForegroundColor Gray
Write-Host ""

# 4. Aguardar report
Write-Host "[4/4] Aguardando report.md..." -ForegroundColor Yellow
Write-Host "  Pressione ENTER quando o Antigravity terminar o audit." -ForegroundColor Gray
Read-Host

if (-not (Test-Path $reportFile)) {
    Write-Host "[ERRO] report.md não encontrado. O Antigravity preencheu?" -ForegroundColor Red
    exit 1
}

# Copiar para clipboard
$reportContent = Get-Content $reportFile -Raw
$reportContent | Set-Clipboard

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  REPORT copiado para o clipboard!" -ForegroundColor Green
Write-Host "  Cole no Claude para review." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Após aprovação do Claude, salve os patches em .orchestra/patches.md" -ForegroundColor Cyan
Write-Host "e rode: .\.orchestra\continue.ps1 -Mission '$Mission'" -ForegroundColor Cyan

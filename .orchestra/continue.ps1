# continue.ps1 - Orquestra a fase de execucao de patches
# Uso: .\.orchestra\continue.ps1 -Mission "nome-da-missao"

param(
    [Parameter(Mandatory=$true)]
    [string]$Mission
)

$orchestraDir = $PSScriptRoot
$patchesFile = Join-Path $orchestraDir "patches.md"
$resultFile = Join-Path $orchestraDir "result.md"
$snapshotFile = Join-Path $orchestraDir "snapshot-before.txt"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ORCHESTRA - Fase de Patches" -ForegroundColor Cyan
Write-Host "  Missao: $Mission" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar pre-condicoes
$tagName = "pre-$Mission"
$tagExists = git tag -l $tagName 2>&1
if (-not $tagExists) {
    Write-Host "[WARN] Tag '$tagName' nao encontrada." -ForegroundColor Yellow
    Write-Host "Rode run-mission.ps1 primeiro, ou o pre-flight falhou." -ForegroundColor Yellow
}

if (-not (Test-Path $patchesFile)) {
    Write-Host "[ERRO] patches.md nao encontrado em $orchestraDir" -ForegroundColor Red
    Write-Host "Peca ao Claude para gerar os patches e salve em: $patchesFile" -ForegroundColor Yellow
    exit 1
}

$patchContent = Get-Content $patchesFile -Raw
if ($patchContent -match "\[Titulo\]") {
    Write-Host "[WARN] patches.md parece ser o template vazio." -ForegroundColor Yellow
    $proceed = Read-Host "Continuar? (S/N)"
    if ($proceed -ne "S") { exit 0 }
}

Write-Host "[1/3] patches.md encontrado. Pronto para o Antigravity." -ForegroundColor Green
Write-Host ""

# 2. Instruir
Write-Host "[2/3] PROXIMOS PASSOS:" -ForegroundColor Cyan
Write-Host "  a) O Antigravity deve ler:" -ForegroundColor White
Write-Host "     - AGENTS.md (regras)" -ForegroundColor Gray
Write-Host "     - .orchestra/patches.md (os patches aprovados)" -ForegroundColor Gray
Write-Host "  b) Apos CADA patch, rodar:" -ForegroundColor White
Write-Host "     - .\.orchestra\verify.ps1" -ForegroundColor Gray
Write-Host "  c) Resultado final em:" -ForegroundColor White
Write-Host "     - .orchestra/result.md" -ForegroundColor Gray
Write-Host ""

# 3. Aguardar resultado
Write-Host "[3/3] Aguardando result.md..." -ForegroundColor Yellow
Write-Host "  Pressione ENTER quando o Antigravity terminar os patches." -ForegroundColor Gray
Read-Host

if (-not (Test-Path $resultFile)) {
    Write-Host "[ERRO] result.md nao encontrado." -ForegroundColor Red
    exit 1
}

# Copiar para clipboard
$resultContent = Get-Content $resultFile -Raw
$resultContent | Set-Clipboard

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  RESULT copiado para o clipboard!" -ForegroundColor Green
Write-Host "  Cole no Claude para gate final." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Se o Claude aprovar e o device-test passar:" -ForegroundColor Cyan
Write-Host "  git push origin main" -ForegroundColor White
Write-Host "  git tag -d $tagName" -ForegroundColor White
Write-Host ""
Write-Host "Se o device-test FALHAR:" -ForegroundColor Yellow
Write-Host "  .\.orchestra\rollback.ps1 -Mission '$Mission'" -ForegroundColor White

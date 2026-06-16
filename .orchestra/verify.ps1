# verify.ps1 — Verificação blindada (tsc + git)
# Uso: .\.orchestra\verify.ps1
# Output: consola + .orchestra\verify-output.txt
# REGRA: Antigravity NUNCA roda tsc diretamente. Usa este script.

param(
    [switch]$Clipboard  # -Clipboard copia output para o clipboard
)

$separator = "=" * 60
$output = @()

$output += $separator
$output += "VERIFY - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
$output += "Commit HEAD: $(git log --oneline -1)"
$output += $separator

# 1. Git status
$output += ""
$output += "=== GIT STATUS ==="
$gitStatus = git status --short 2>&1
if ($gitStatus) {
    $output += $gitStatus
} else {
    $output += "(working tree limpa)"
}

# 2. TypeScript — output INTEGRAL, sem filtros
$output += ""
$output += "=== TSC --noEmit (integral) ==="
$tscOutput = npx tsc --noEmit 2>&1
if ($tscOutput) {
    $output += $tscOutput
} else {
    $output += "(zero erros)"
}

# 3. Contagem de erros (informativa, NÃO substitui o output acima)
$errorCount = ($tscOutput | Select-String "error TS" | Measure-Object).Count
$output += ""
$output += "=== CONTAGEM (referência, NÃO usar como verificação isolada) ==="
$output += "Total de linhas com 'error TS': $errorCount"

# 4. Git log recente
$output += ""
$output += "=== GIT LOG (últimos 5) ==="
$output += (git log --oneline -5 2>&1)

$output += ""
$output += $separator
$output += "FIM VERIFY"
$output += $separator

# Escrever em ficheiro
$outputPath = Join-Path $PSScriptRoot "verify-output.txt"
$output | Out-File -FilePath $outputPath -Encoding UTF8

# Mostrar na consola
$output | ForEach-Object { Write-Host $_ }

# Copiar para clipboard se pedido
if ($Clipboard) {
    $output -join "`n" | Set-Clipboard
    Write-Host "`n[VERIFY] Output copiado para o clipboard." -ForegroundColor Green
}

Write-Host "`n[VERIFY] Salvo em: $outputPath" -ForegroundColor Cyan

# pre-flight.ps1 — Captura estado "antes" no início de cada missão
# Uso: .\.orchestra\pre-flight.ps1 -Mission "nome-da-missao"
# Output: .orchestra\snapshot-before.txt + tag git

param(
    [Parameter(Mandatory=$true)]
    [string]$Mission
)

$separator = "=" * 60
$timestamp = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
$headHash = (git rev-parse HEAD 2>&1).Trim()
$tagName = "pre-$Mission"

$output = @()
$output += $separator
$output += "PRE-FLIGHT SNAPSHOT"
$output += "Missão: $Mission"
$output += "Data: $timestamp"
$output += "HEAD: $headHash"
$output += "Tag: $tagName"
$output += $separator

# 1. Criar tag de backup
$existingTag = git tag -l $tagName 2>&1
if ($existingTag) {
    git tag -d $tagName 2>&1 | Out-Null
    $output += "[WARN] Tag '$tagName' já existia — substituída."
}
git tag $tagName HEAD
$output += "Tag '$tagName' criada em $headHash"

# 2. Git status
$output += ""
$output += "=== GIT STATUS ==="
$gitStatus = git status --short 2>&1
if ($gitStatus) {
    $output += $gitStatus
    $output += "[WARN] Working tree NÃO está limpa. Considerar commit/stash antes de prosseguir."
} else {
    $output += "(working tree limpa)"
}

# 3. Unpushed commits
$output += ""
$output += "=== COMMITS NÃO PUSHED ==="
$unpushed = git log origin/main..HEAD --oneline 2>&1
if ($unpushed -and $unpushed -notmatch "fatal") {
    $output += $unpushed
} else {
    $output += "(tudo sincronizado com origin/main)"
}

# 4. TSC baseline
$output += ""
$output += "=== TSC BASELINE ==="
$tscOutput = npx tsc --noEmit 2>&1
$errorCount = ($tscOutput | Select-String "error TS" | Measure-Object).Count
$output += "Erros tsc: $errorCount"
$output += "(output integral disponível via .orchestra\verify.ps1)"

# 5. Branch info
$output += ""
$output += "=== BRANCH ==="
$output += "Branch: $(git branch --show-current 2>&1)"
$output += "Remote: $(git remote get-url origin 2>&1)"

$output += ""
$output += $separator
$output += "FIM PRE-FLIGHT"
$output += $separator

# Gravar snapshot
$snapshotPath = Join-Path $PSScriptRoot "snapshot-before.txt"
$output | Out-File -FilePath $snapshotPath -Encoding UTF8

# Mostrar na consola
$output | ForEach-Object { Write-Host $_ }

Write-Host "`n[PRE-FLIGHT] Snapshot salvo em: $snapshotPath" -ForegroundColor Green
Write-Host "[PRE-FLIGHT] Tag '$tagName' criada. Para rollback: .\.orchestra\rollback.ps1 -Mission '$Mission'" -ForegroundColor Cyan

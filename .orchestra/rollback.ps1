# rollback.ps1 — Reverte ao estado pré-missão
# Uso: .\.orchestra\rollback.ps1 -Mission "nome-da-missao"
# Segurança: só reverte se a tag existe e os commits não foram pushed

param(
    [Parameter(Mandatory=$true)]
    [string]$Mission,
    [switch]$Force  # -Force pula confirmação (usar com cautela)
)

$tagName = "pre-$Mission"

# 1. Verificar que a tag existe
$tagExists = git tag -l $tagName 2>&1
if (-not $tagExists) {
    Write-Host "[ROLLBACK] ERRO: Tag '$tagName' não encontrada." -ForegroundColor Red
    Write-Host "Tags disponíveis:" -ForegroundColor Yellow
    git tag -l "pre-*"
    exit 1
}

$tagHash = (git rev-parse $tagName 2>&1).Trim()
$headHash = (git rev-parse HEAD 2>&1).Trim()

if ($tagHash -eq $headHash) {
    Write-Host "[ROLLBACK] HEAD já está em '$tagName'. Nada a reverter." -ForegroundColor Yellow
    exit 0
}

# 2. Verificar que os commits da missão NÃO foram pushed
$pushed = git log "origin/main..$tagName" --oneline 2>&1
$missionCommits = git log "$tagName..HEAD" --oneline 2>&1
Write-Host ""
Write-Host "=== COMMITS DA MISSÃO (serão revertidos) ===" -ForegroundColor Yellow
Write-Host $missionCommits
Write-Host ""

$pushedCheck = git log "origin/main..HEAD" --oneline 2>&1
$pushedHashes = @()
if ($pushedCheck -and $pushedCheck -notmatch "fatal") {
    # Todos os commits entre tag e HEAD devem estar APÓS origin/main
    $commitsAfterOrigin = git log "origin/main..HEAD" --format="%H" 2>&1
    $commitsInMission = git log "$tagName..HEAD" --format="%H" 2>&1
    
    foreach ($hash in $commitsInMission) {
        if ($commitsAfterOrigin -notcontains $hash) {
            Write-Host "[ROLLBACK] ERRO: Commit $($hash.Substring(0,7)) já está em origin/main." -ForegroundColor Red
            Write-Host "Rollback de commits pushed é PROIBIDO. Use git revert." -ForegroundColor Red
            exit 1
        }
    }
}

# 3. Confirmar
if (-not $Force) {
    Write-Host "[ROLLBACK] Reverter HEAD de $(($headHash).Substring(0,7)) para '$tagName' ($(($tagHash).Substring(0,7)))?" -ForegroundColor Yellow
    $confirm = Read-Host "Escrever 'SIM' para confirmar"
    if ($confirm -ne "SIM") {
        Write-Host "[ROLLBACK] Cancelado." -ForegroundColor Yellow
        exit 0
    }
}

# 4. Executar rollback
Write-Host "[ROLLBACK] Executando git reset --hard $tagName ..." -ForegroundColor Red
git reset --hard $tagName

Write-Host ""
Write-Host "[ROLLBACK] Concluído. HEAD agora em:" -ForegroundColor Green
git log --oneline -1
Write-Host ""
Write-Host "[ROLLBACK] Tag '$tagName' mantida para referência." -ForegroundColor Cyan
Write-Host "Para limpar após confirmar: git tag -d $tagName" -ForegroundColor Cyan

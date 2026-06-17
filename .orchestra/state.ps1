# state.ps1 — Snapshot READ-ONLY do estado do projeto AURA.
# Uso interativo:  .\.orchestra\state.ps1
# Tambem usado pelo git hook post-commit (redireciona a saida para .orchestra\snapshot.md).
# NAO altera o repo, NAO commita, NAO faz push. Usa o stream de saida (compativel com ">").

$root = "E:\PROJETO AURA"

Write-Output "=== SNAPSHOT AURA — $(Get-Date -Format 'yyyy-MM-dd HH:mm') ==="
Write-Output ""
Write-Output "=== ARVORE / BRANCH ==="
git -C $root rev-parse --show-toplevel
Write-Output ("branch: " + (git -C $root branch --show-current))
Write-Output ""
Write-Output "=== ULTIMOS COMMITS ==="
git -C $root log --oneline -8
Write-Output ""
Write-Output "=== WORKING TREE ==="
$st = git -C $root status --short
if ($st) { $st } else { Write-Output "(limpa)" }
Write-Output ""
Write-Output "=== REMOTE ==="
$rm = git -C $root remote -v
if ($rm) { $rm } else { Write-Output "(sem remote configurado)" }
Write-Output ""
Write-Output "=== VERSOES-CHAVE ==="
Write-Output ("node: " + (node -v))
$pkg = Get-Content "$root\package.json" -Raw | ConvertFrom-Json
Write-Output ("expo: " + $pkg.dependencies.expo)
Write-Output ("react-native: " + $pkg.dependencies.'react-native')
Write-Output ("expo-router: " + $pkg.dependencies.'expo-router')
Write-Output ""
Write-Output "=== APP CONFIG (arch / scheme / package) ==="
Select-String -Path "$root\app.json" -Pattern 'newArchEnabled|scheme|"package"' | ForEach-Object { $_.Line.Trim() }
Write-Output ""
Write-Output "=== FIM SNAPSHOT ==="

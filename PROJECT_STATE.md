# PROJECT_STATE.md — AURA

> Contexto durável, independente do chat. Numa sessão NOVA do Claude: lê `AGENTS.md`
> (regras) + este ficheiro + `.orchestra\snapshot.md` (estado vivo, auto-gerado). Chega.
> NÃO colar trajetórias do Antigravity no Claude — só blocos de resultado.
> Este ficheiro é mantido automaticamente: hook `post-commit` atualiza o snapshot; o
> executor atualiza o narrativo no fim de cada missão. Não precisas de pedir.

**Última sessão:** 2026-06-17 · ver `.orchestra\snapshot.md` para commit/branch atuais.

## O que é
App mobile offline-first de empratamento (visão computacional clássica on-device).
Dogmas, fronteiras e regras de execução: ver `AGENTS.md` (fonte única — não duplicar).

## Decisões trancadas — e o porquê (registo durável)
- **Expo SDK 54 fixo** — estabilidade; pin determinístico `--template default@sdk-54`.
- **New Architecture LIGADA** (reverteu o plano "New Arch = v2") — o SDK 54 é a ÚLTIMA
  SDK com Legacy Arch; ficar em legacy seria beco sem saída e tornaria a v2 numa migração
  forçada. New Arch é o caminho suportado para o futuro módulo nativo de CV.
- **Build via EAS (nuvem), não local** — C: com ~52 MB livres; EAS dispensa o toolchain
  Android local. Tier grátis (~15 builds Android/mês) chega. Não fere o dogma "sem nuvem
  no caminho crítico" (isto é build, não runtime).
- **Projeto + cache npm + tmp em E:** — C: sem espaço (ENOSPC).
- **Regras como `AGENTS.md` commitado, não `GEMINI.md` global** — o global estava
  desatualizado (dizia "alta gastronomia" + AsyncStorage) e vazava para outros projetos.
- **Público = cozinheiro EM ASCENSÃO, não chef Michelin** (corrigido do GEMINI.md velho).
- **Dados:** foto no filesystem (`expo-file-system`), NUNCA AsyncStorage; metadados no
  Supabase; UUID do device = nome do ficheiro + id da linha. (Ainda não implementado.)

## Regras de processo (lições desta sessão)
- **Superfícies do executor = repo `aura` + EAS + linha de comandos.** NUNCA outros
  projetos (houve incidente: leu o CLAUDE.md do AetherVault) nem internos do IDE (pasta
  `brain/`). Precondição/credencial em falta → PARA e reporta.
- **Blocos de investigação = PowerShell puro, só comentários `#`** (prosa no bloco rebenta no PS).
- **Economia de tokens:** nunca colar trajetórias do executor no Claude — só resultados.
- **EAS é estrito (`npm ci`):** `package-lock.json` tem de estar sincronizado, senão o build falha.

## Próximo passo
- **Missão 04**: Motor de Regras + Cards de Técnica (Douramento como caso-piloto).

## Dívidas técnicas (M3)
1. **UI Provisória**: a UI no `index.tsx` foi inventada para o MVP intermédio, aguardando a missão focada em UI (antiga dívida #3).

## Riscos / em aberto
- **C: ~52 MB livres** — libertar espaço (perigoso para o Windows).

## Histórico de missões
- **00 — bootstrap** (✅ 2026-06-17): Expo SDK 54 + New Arch + esqueleto engine/content/storage/components + EAS dev build validado no Redmi Note 10. expo-doctor 18/18.
- **01 — captura→thumbnail→filesystem** (✅ CONCLUÍDA): captura guiada por acelerómetro + thumbnail + gravação no filesystem, validada no device e no GitHub.
- **02 — hardening** (✅ CONCLUÍDA): migração do filesystem para a API nova (File/Directory) + jest-expo configurado com testes reais ativos + moldura-guia removida de dentro de `<CameraView>` para overlay absoluto. Dívida #5 (ícone em falta) confirmada como falso alarme.
- **03 — metric-browning** (✅ CONCLUÍDA): métrica pura de douramento/tostado (`browningFraction` em HSV) no `engine/metrics/` + testes unitários de extremos + ponte `readThumbnailPixels` no `storage/pixels.ts` + fix do icon raiz para calar o Metro.




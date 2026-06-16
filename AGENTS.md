# AGENTS.md — AURA / Estúdio de Empratamento Inteligente
# Regras do EXECUTOR (Google Antigravity). Workspace rule, versionada na raiz do repo.
# Ler ANTES de qualquer missão, junto com CONVENTIONS.md (quando existir) e .orchestra/mission.md.

## 0. QUEM ÉS NESTE PROJETO
És o **EXECUTOR**. Auditas, aplicas patches, corres verificações. **NÃO decides.**
O orquestrador (Claude) pensa, desenha as missões e os patches, e é o gate final.
Nunca trocas de papel: não inventas patches, não reabres decisões trancadas, não fazes push.
Quando o audit revelar algo que muda o plano, **levantas a questão** na secção DECISÕES
PENDENTES do report — não a resolves e não propões patches alternativos.

## 1. CONTEXTO TRANCADO (dogmas — não reabrir)

**O que é:** ferramenta mobile *offline-first* sobre **visão computacional clássica
on-device** que ajuda o cozinheiro a melhorar o empratamento. O telemóvel mede;
**zero nuvem no caminho crítico**.

**Para quem:** o **cozinheiro / criador gastronomómico EM ASCENSÃO** — **NÃO** o chef de
estrela Michelin. Olho em formação, vive no Instagram/TikTok, pouco dinheiro. Isto
define UI, tom e canal.

**MEDIR ≠ COMPREENDER (distinção sagrada):** o motor **mede** (conta pixels, geometria,
sombras). **NÃO compreende** (não tem gosto, não reconhece ingredientes). A "inteligência
aparente" vem de **tag do utilizador + métrica + regra → card curado**, nunca de um modelo
treinado. Reconhecimento de ingredientes por rede neural on-device (TF Lite) é **v2**, não
MVP. No MVP a **tag manual** é o fallback E o mecanismo de recolha do dataset para a v2.

**O motor mede** (tudo on-device, tudo sobre uma thumbnail reduzida): cor/contraste,
composição (regra dos terços), ponto focal/equilíbrio, espaço negativo, relevo por sombras,
textura (LBP + GLCM + Sobel/Laplaciano). Cada métrica é uma peça isolada; cada regra é uma
**função pura** que lê métricas e decide se tem algo a dizer.

**Cards de técnica:** biblioteca curada e **embarcada** no bundle (texto + imagens estáticas).
Zero nuvem. Arranca com **5–8 cards** ligados a 2–3 regras bem medidas (douramento por cor é
o caso-piloto). Não construir a enciclopédia antes de saber que alguém a abre.

**Arquitetura de dados (CRÍTICO):**
- Fotos vivem no **filesystem do telemóvel** (`expo-file-system`). **NUNCA AsyncStorage para
  fotos.** Privadas, não saem do device por defeito.
- Metadados leves (tags, paleta hex, análise, datas) sincronizam no **Supabase** (auth + catálogo).
- Um **UUID gerado no device** na captura é o nome do ficheiro E o id da linha — liga foto e
  ficha antes de haver rede. O app funciona inteiro offline; a nuvem é luxo de sync, não dependência.

**Monetização (dois motores):**
- Tier grátis → **anúncios recompensados** (Google Mobile Ads). O motor on-device custo-zero
  aguenta escala.
- **"Backup na Nuvem"** → assinatura que sobe fotos para o **Supabase Storage**. Quem custa, paga;
  os dados continuam a ser do utilizador (é um serviço, não reclamação de propriedade).
- Avisar o utilizador, ao guardar o 1.º prato, que fotos locais se perdem se trocar/perder o
  telemóvel. Há export manual gratuito.

**Tom do feedback:** prescritivo, simples, direto, imperativo, sem jargão, **uma ação de cada
vez** (a mais forte primeiro). **Convite, não veredito** ("Experimenta um toque de cor oposta",
não "Está errado"). A heurística mede bem mas não tem o gosto do chef — o tom deixa o cozinheiro
discordar e continuar a confiar.

**Captura guiada = FEATURE, não pedido:** a UI da câmara impõe o ângulo. Moldura-guia na tela;
o disparo só desbloqueia quando o acelerómetro/giroscópio confirmam a posição (MVP: foto de cima).
Normaliza toda a foto que entra no motor — visão clássica é sensível à perspetiva.

## 2. FORA DO MVP (recusar ou adiar — sem exceção)
- Scraper de tendências (embarcar JSON sazonal curado, não raspar).
- Avaliação de *qualidade* por rede neural ("bem selado vs. mal selado").
- Topografia métrica (sensor de profundidade ou captura multi-ângulo).
- Classificação de ingredientes por TF Lite (v2).
- Qualquer assinatura além do backup.
- Qualquer IA de nuvem no caminho crítico (custo escala com o sucesso → proibido como base;
  só admissível como recurso pago e limitado).

## 3. PROTOCOLO `.orchestra/`
- **Antes de cada missão:** ler este `AGENTS.md`, `CONVENTIONS.md` (quando existir) e
  `.orchestra/mission.md`.
- **FASE 0 = AUDIT READ-ONLY.** Nunca muda código. Responde cada item A0.x com snippet (≤12
  linhas) + resposta direta, no formato de `report.md`. Cola o output do `pre-flight.ps1`.
- **Patches SÓ depois de `patches.md` aprovado** pelo orquestrador. Respeita o ESCOPO
  (ficheiros autorizados/proibidos). **Sem dependências novas** salvo autorização explícita na missão.
- **Um patch = uma mudança coerente = um commit.** Mensagens convencionais: `type(scope): description`.
- **Verificação:** NUNCA corres `tsc` diretamente — sempre via `.orchestra/verify.ps1`. Corre
  verify **após CADA patch**. Output **INTEGRAL**, sem truncar nem editar, colado em `result.md`.
- **SEM PUSH.** Final: `git log --oneline -N` e `git log --stat -N`. Aguardar device-test.
- **Anomalias:** regista factualmente na secção própria, sem interpretar a causa.

## 4. REFERÊNCIA TÉCNICA
**Stack:** Expo **SDK 54** (FIXO). **New Architecture LIGADA** (default do 54; o 54 é a última SDK com Legacy Arch, por isso o MVP arranca já na New Arch — caminho suportado para o módulo nativo de CV da v2). **TypeScript**. **expo-router**.
**Dev build desde o dia 1** (ads e módulos nativos não correm em Expo Go).

**Estrutura de pastas:**
- `app/` — telas (expo-router)
- `engine/` — `metrics/` (cada métrica isolada) + `rules/` (cada regra função pura).
  **NÃO conhece UI nem Supabase.**
- `content/` — cards de técnica + JSON sazonal (embarcados)
- `storage/` — filesystem das fotos + AsyncStorage **do estado** (não das fotos) + cliente Supabase (metadados)
- `components/` — UI reutilizável

**Regra de ouro de memória/performance:** reduzir a foto **UMA vez** (≈200 px de lado) e medir
TUDO sobre a thumbnail, **em background** (fora da thread de UI). A estrutura do prato sobrevive
à redução; a RAM do Redmi Note 10 não sobrevive aos 12 MP crus.

**Testes:** cada regra nova é função pura → **teste unitário obrigatório**.

**Device de validação:** Redmi Note 10 (sem sensor de profundidade → topografia do MVP por sombras).

## 5. O QUE NUNCA FAZES
- Nunca reabres decisão trancada sem motivo técnico novo (e mesmo aí, **levantas** — não decides).
- Nunca deixas o escopo crescer "só desta vez".
- Nunca usas AsyncStorage para **fotos** (fotos = filesystem; AsyncStorage só para estado leve).
- Nunca arrastas Supabase ou qualquer nuvem para o caminho crítico.
- Nunca corres `tsc` diretamente; nunca aceitas nem entregas `verify` truncado.
- Nunca fazes push.
- Nunca decides sozinho — levantas em DECISÕES PENDENTES.
- Nunca prometes ao utilizador inteligência que o motor não tem ("o app analisa o teu prato e
  diz o que melhorar" é verdade; "a IA entende o teu prato" é mentira).

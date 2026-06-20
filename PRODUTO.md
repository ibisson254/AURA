# PRODUTO — Norte do Estúdio de Empratamento Inteligente
> Addendum ao `CLAUDE.md`. Refina a ÊNFASE do produto dentro do contexto
> trancado da secção 2 — **não o substitui**. Em conflito, o `CLAUDE.md` manda e
> o dono decide.
> Próximo Claude / Antigravity: ler **depois** do `CLAUDE.md` e do `PROJECT_STATE.md`.
> Porquê este ficheiro: numa sessão deixámos a métrica mais fácil de medir
> (douramento) sequestrar o produto. Isto reancora o norte para não repetir.

---

## A FRASE ÚNICA
A app é um **assistente de design de prato**. Olha para a comida **já cozinhada**
e orienta o **arranjo** — onde pôr, quanto espaço deixar, como equilibrar cor e
peso, onde criar foco. Trata o prato como uma tela. **Nunca julga a cozinha.**

## A LINHA QUE SEPARA AS DUAS APPS
- ❌ "A tua carne podia estar mais selada." → fala da **comida**. É veredito sobre
  o ofício do cozinheiro. A heurística não tem competência nem direito para isso.
- ✅ "Tens tudo encostado à direita — abre espaço, deixa o lado esquerdo respirar."
  → fala do **arranjo**. É design, é **movível agora**, sem voltar ao fogão.

Tudo o que a app diz tem de cair do lado direito desta linha. Comenta o **arranjo
na foto**, não o prato em abstrato nem a qualidade do que foi cozinhado.

## PORQUE ESTE É O PRODUTO HONESTO
Encaixa no dogma sagrado **MEDIR vs. COMPREENDER** (CLAUDE.md §2): composição é
geometria e distribuição de pixels — mede-se honestamente **sem** perceber que
aquilo é porco. "Bem grelhado" exigiria *compreender* (ingrediente, técnica,
gosto) = v2 com rede neural. O design não. Por isso a tese de arranjo não é só
melhor produto — é a única honesta com o que o motor sabe fazer hoje.

## O QUE ISTO REORDENA NAS PRIORIDADES
- **Douramento desce de protagonista a, no máximo, conselho menor de cor** —
  provavelmente nem entra no MVP. Foi **andaime** (o "caso-piloto" do CLAUDE.md):
  serviu para provar o pipeline ponta-a-ponta, não para ser o coração.
- **Passam ao centro** as métricas de design já listadas no CLAUDE.md §2:
  composição (regra dos terços, posição no enquadramento), espaço negativo
  (comida vs. vazio), equilíbrio (peso visual por quadrante), ponto focal, e cor
  como **paleta/contraste** (não como douramento).

## A FENDA POR RESOLVER (decisão de produto — do dono, não técnica)
A geometria não sabe onde acaba a comida e começa o prato. Isto parte as métricas
de design em duas famílias:

- **Honestas JÁ, sem segmentação** (medem sobre o frame inteiro):
  enquadramento / regra dos terços, centragem do conjunto, peso visual por
  quadrante. "O teu prato está descentrado, desloca o foco" funciona sem saber o
  que é comida.
- **Exigem segmentação comida-vs-fundo** (não existe no MVP, por dogma):
  "espaço negativo **da comida**", "paleta **da comida**". Sem segmentar, um prato
  branco grande lê como "muito espaço negativo" quando é só loiça.

**DECISÃO PENDENTE (a próxima a desbloquear o roadmap):**
> A 1.ª regra de design do MVP mede sobre o **frame inteiro** (enquadramento /
> terços / equilíbrio — honesta já), **ou** aceita-se a **segmentação
> comida-vs-fundo** dentro do MVP como a fundação que "espaço negativo" e
> "paleta" exigem?
>
> Recomendação do orquestrador: começar pelo **frame inteiro** (menor, honesto
> hoje), e marcar a segmentação como o salto de roadmap que desbloqueia metade do
> produto. Mas é chamada de produto — fica para o dono.

## ESTADO PROVADO (não é desperdício)
- O pipeline **captura guiada → thumbnail → `analyze()` → conselho no ecrã** está
  provado no device (Redmi Note 10), missão `06-fatia-vertical`.
- A arquitetura (`analyze` compõe métricas; regras puras emitem `Advice`
  ordenado por prioridade) foi desenhada para **trocar a peça medida sem
  reescrever o resto**. Trocar douramento por uma métrica de design é trocar a
  peça, não a fundação. O andaime serviu.

## DADOS REAIS RECOLHIDOS (porque o douramento desceu)
- Porco grelhado real → fração de douramento **0.085**. Foto aleatória → **0.000**.
- Lição: a fração é de **TODA a imagem**, por isso é estruturalmente baixíssima em
  fotos reais e **mistura duas coisas distintas** — *quão dourada está a comida* e
  *quanto do frame a comida ocupa*. O limiar `0.10` está alto por ~1 ordem de
  grandeza, e mesmo recalibrado mede "área dourada no enquadramento", não "grau de
  douramento". Confirma que medir sobre o frame inteiro tem tetos a nomear, não a
  esconder.

## O QUE NÃO MUDOU (continua trancado — CLAUDE.md §2 e §9)
Offline-first; custo-zero on-device; a foto não sai do telemóvel por defeito;
medir-não-compreender; captura guiada como feature; tom **convite, não veredito**,
uma ação de cada vez, a mais forte primeiro; UUID no device liga foto e ficha;
nuvem é luxo de sync pago, nunca caminho crítico.

---

### PRÓXIMO PASSO
1. O dono responde à DECISÃO PENDENTE acima (frame-inteiro vs. segmentação no MVP).
2. O orquestrador desenha a missão `07` à volta dessa métrica — a **primeira regra
   de design**, a substituir o douramento como caso-piloto a sério.
3. Uma métrica de cada vez. As outras entram em fila.

# Destrave

Landing page estática (HTML + CSS + JS puro, sem build) com formulário.

## Estrutura

```
.
├── index.html            só redireciona pra destrave/ (ver Endereço)
├── destrave/             o site; vira a subpasta no servidor
│   ├── index.html        página do evento
│   ├── obrigado.html     destino do formulário, com o botão de WhatsApp
│   └── assets/
│       ├── css/style.css tokens de design + estilos
│       ├── js/main.js    scripts (sem dependências)
│       ├── img/          imagens, logo, favicon, og-image
│       ├── video/        o mp4 da hero
│       └── fonts/        fontes locais (@font-face)
├── .nojekyll
├── .gitignore
├── .editorconfig
└── README.md
```

A pasta `destrave/` não é organização interna: é ela que produz o caminho
`/destrave` no servidor. Mexer no nome dela muda a URL pública.

## Por que sem build

O deploy por Git da Hostinger apenas copia os arquivos do repositório para
`public_html`. Não roda `npm install` nem `npm run build`. Por isso o projeto
entrega HTML/CSS/JS finais prontos: o que está no repo é, arquivo por arquivo,
o que vai ao ar.

## Rodar localmente

Abrir `destrave/index.html` no navegador já funciona. Para um servidor local,
rodar na raiz do repositório e acessar `http://localhost:8000/destrave/`, que
reproduz o caminho de produção:

```bash
python -m http.server 8000
```

## Prévia no GitHub Pages

A avaliação visual roda em
`https://agenciagapper.github.io/destrave/destrave/`, servido da branch
`main` na raiz. O `destrave` repetido não é engano: o primeiro é o nome do
repositório, que o Pages usa como caminho, e o segundo é a pasta do site.
Abrir `https://agenciagapper.github.io/destrave/` também funciona, porque o
redirecionamento da raiz cai lá.

O arquivo vazio `.nojekyll` desliga o processamento Jekyll, que não serve
pra nada num site sem build e ignora caminhos começados com underline. Ele
fica na raiz do repositório, que é onde o Pages procura.

Nem todo push publica. Nesta sessão, os pushes feitos por `git push` a
partir do agente pararam de gerar o build a partir de certo ponto: os
commits chegam na `main`, mas nenhum "pages build and deployment" novo
aparece na aba Actions. O sintoma bate com a regra do GitHub de não
disparar workflow para push autenticado com token de app — commits criados
pela API do GitHub ou pela interface web, que ficam atribuídos à conta,
disparam normalmente.

*Re-run* no workflow não resolve: ele reconstrói o commit daquela execução,
não a ponta da branch. O que refaz o deploy é gerar um evento novo —
qualquer commit pela interface web ou pela API, ou trocar a origem em
*Settings → Pages* (para None, salvar, e de volta para `main` / raiz).

## Endereço de produção

A página vai ao ar em **https://rmaeducacao.com.br/destrave/**.

A subpasta vem do próprio repositório, e não de configuração do painel. O
deploy Git da Hostinger copia o repositório inteiro para `public_html`, com
o campo de diretório em branco. Como o site mora em `destrave/`, ele
aterrissa em `public_html/destrave/` e o caminho aparece sozinho. Renomear
essa pasta muda a URL pública, e não há nada no hPanel pra mexer junto.

Na raiz sobra um `index.html` que só redireciona pra `destrave/`, pra quem
chegar por um link antigo não bater num 404. Ele leva a query e a âncora
adiante, senão um anúncio que apontasse pra raiz perderia as UTMs no salto
e o lead chegaria no Make sem origem. O destino é relativo de propósito: um
`/destrave/` absoluto funcionaria na Hostinger e entraria em laço no
GitHub Pages, onde a raiz publicada já é `/destrave/`. Esse arquivo some no
dia em que o site principal da RMA ocupar a raiz.

Todos os caminhos internos são relativos (`assets/css/style.css` no HTML,
`../img/hero-1200.webp` no CSS), então a página funciona em qualquer pasta.
O que é absoluto e aponta pro endereço final são três metatags de
`destrave/index.html`: `canonical`, `og:image` e `og:url`. Se a URL mudar,
mudar as três juntas.

Acessar `rmaeducacao.com.br/destrave` sem a barra final funciona: o
servidor redireciona pra versão com barra antes de servir o `index.html`.

## Deploy na Hostinger (Git)

1. hPanel → **Site** → **Avançado** → **Git**.
2. Em *Criar novo repositório*: colar a URL do repo, branch `main`, e
   **deixar o campo de diretório em branco**. A subpasta já vem de dentro
   do repositório; preencher `destrave` aqui publicaria em
   `public_html/destrave/destrave/`.
3. Repo privado: copiar a **chave SSH pública** que a Hostinger exibe e
   cadastrá-la no GitHub em *Settings → Deploy keys* do repositório.
4. Cada atualização: botão **Deploy** no hPanel, ou o **webhook** que a
   Hostinger fornece, cadastrado em *Settings → Webhooks* do GitHub, para
   deploy automático a cada push.

### Sobras da versão que publicava na raiz

Antes desta mudança o site era publicado na raiz de `public_html`. O deploy
Git não apaga arquivo que saiu do repositório, então `assets/` e
`obrigado.html` continuam na raiz do servidor, parados na versão daquele
dia. O `index.html` da raiz é sobrescrito pelo redirecionamento e não
precisa de nada.

Não quebram nada, mas servem uma cópia velha da página em endereços que
ninguém deveria alcançar, e ocupam os 30 MB do vídeo à toa. Apagar
`public_html/assets/` e `public_html/obrigado.html` pelo Gerenciador de
Arquivos resolve, sem encostar em `public_html/destrave/`.

### Se a subpasta der 404 ou cair no site principal

Um `.htaccess` na raiz pode estar capturando a URL antes de o Apache achar
a pasta. As regras padrão do WordPress não fazem isso, porque só reescrevem
o que não é arquivo nem diretório existente, mas redirecionamentos manuais
e plugins de cache fazem. Conferindo pela ordem: a pasta
`public_html/destrave` existe e tem `index.html` dentro; o `.htaccess` da
raiz não tem `RewriteRule` sem as condições `!-f` / `!-d`; e nenhum plugin
de redirecionamento pega `/destrave`.

## Dúvidas frequentes e rodapé

A dobra 8 (`.faq`) usa `<details>` e `<summary>` puros: abre e fecha sem
JS nenhum, e o leitor de tela anuncia expandido ou recolhido sozinho, sem
`aria-expanded` na mão. O ícone é um mais que gira 45 graus e vira um xis
quando o item abre. Somar pergunta é copiar um `.faq__item`.

As seis perguntas e respostas vieram da página
`rogeriomagalhaes.com/destrave-sua-comunicacao-v3`, a pedido do cliente.
A única alteração foi a data: lá está a edição de março de 2026, e aqui
vale a data desta página. As duas precisam mudar juntas quando a data
mudar (ver *Data do evento*).

O rodapé fecha com a logo, a linha do evento, o botão de contato no
WhatsApp (mesmo número e mesma mensagem do resto da página, montados pelo
`CONFIG`) e o copyright.

## Data do evento

Aparece em dois lugares e os dois precisam ser alterados juntos:

- `destrave/index.html`, atributo `data-deadline` do bloco `#countdown` (formato ISO com
  fuso, ex. `2026-09-04T00:00:00-03:00`) — alimenta a contagem regressiva.
- `destrave/index.html`, parágrafo `.hero__when` — data e cidade exibidas na hero.
- `destrave/index.html`, pílula `.oferta__meta` da dobra 7.
- `destrave/index.html`, resposta da pergunta sobre os dias na
  dobra 8, e a linha `.rodape__evento`.

## Copy pendente de confirmação

Trechos que não vieram do cliente e ainda precisam do aval dele:

- **Dobra 5, campo "assunto" dos experts** (`.expert__assunto`):
  *Comunicação estratégica*, *Liderança e oratória* e *Comunicação
  corporativa* foram derivados das próprias bios, não informados. O tema
  real de cada bloco pode ser outro.
- **Dobra 5, segundo destaque**: só o card do Rogério está marcado. Falta
  definir qual é o segundo e o texto do selo.
- **Dobra 6, nome de dois depoentes**: os vídeos `iTaWHYQysAk` e
  `MZHvsHiOvp0` vieram sem nome e sem profissão, e os cards estão com
  *Participante do Destrave* no lugar. É a pendência mais visível da
  página hoje.
- **Dobra 6, grafia do sobrenome**: o título do vídeo no canal da RMA diz
  *Patrícia Sanches*, e foi essa a grafia usada. Se o correto for
  *Sanchez*, muda no card.
- **Dobra 6, título e linha de apoio**: a versão original dizia *como
  falava na sexta* e afirmava que todos terminaram *o domingo no palco*.
  As duas frases foram trocadas quando a data da página ainda era 12, 13
  e 14 de setembro, que cai em sábado, domingo e segunda e derrubava as
  duas. Com a data corrigida para 4, 5 e 6, que é sexta, sábado e
  domingo, *na sexta* volta a ser verdade e pode ser restaurado no
  título se preferirem a versão mais concreta. Está como *na chegada*,
  que não depende do dia da semana e sobrevive à próxima troca de data.
  Já a linha de apoio segue sem afirmar o palco, e isso não tem a ver com
  o calendário: nenhum dos cinco vídeos comprova que aquelas pessoas
  subiram no palco.
- **Dobra 7, selo do card de preço**: está escrito *Vagas limitadas*, que
  é o que a barra fixa já diz. Se existir lote com percentual de desconto
  definido, é aqui que ele entra, no lugar do selo atual.
- **Dobra 8, horários do evento**: a pergunta herdada da página de origem
  era *Quais são os dias e os horários*, mas a resposta de lá só dava os
  dias. Como a grade de horários não foi informada, a pergunta passou a
  ser só *Quais são os dias do evento?*. Havendo horário de início e
  término, dá pra devolver a pergunta ao formato original e completar a
  resposta.

  Pela mesma razão, o `data-deadline` mira `00:00:00` do dia 4 e não uma
  hora de abertura: a contagem regressiva conta até o dia do evento, sem
  cravar horário que ninguém confirmou.
- **Dobra 7, condição de pagamento**: a referência que originou esta dobra
  mostra parcelamento e barra de vagas preenchidas. Ficaram de fora porque
  nenhum dos dois foi informado, e número de vaga preenchida sem base é o
  tipo de dado que o público checa. Havendo parcelamento real, ele cabe
  entre a nota e o botão.

## Assets

- **Fontes** ficam em `destrave/assets/fonts/` e são carregadas por `@font-face` local,
  sem chamada ao Google Fonts: Archivo (títulos e corpo), Instrument Serif
  itálica (linha de ênfase) e IBM Plex Mono (dígitos do contador).
- **Cards da dobra 2**: `trava-1.webp` (o branco na hora H), `trava-2.webp`
  (perde o fio da apresentação) e `trava-3.webp` (desiste de gravar) são fotos
  geradas no Magnific, 800×1000 (4:5), tratadas no vinho da paleta e com a
  metade de baixo caindo pro escuro — é onde o texto do card entra. Ao trocar
  qualquer uma, manter o nome do arquivo e a mesma receita: vertical 4:5,
  assunto na metade de cima, metade de baixo sem elemento importante.
- **Fotos do evento (dobra 4)**: todas da edição anterior da imersão.
  `evento-sala` (1800×600) abre a dobra sangrando de ponta a ponta;
  `evento-reflexao` (1200×800, recortada em 2:1 pelo CSS), `evento-treino`
  e `evento-palco` (1200×600) e `evento-abraco` (1200×800) entram dentro
  das etapas 01, 03, 06 e 07. Ao trocar, manter os nomes e conferir o
  `object-position` da etapa correspondente pra não cortar rosto.
  `evento-mentor`, `evento-turma` e `evento-microfone` ficam no repositório
  como reserva para as próximas dobras — hoje não são usadas por nenhuma
  página.
- **Retratos dos experts (dobra 5)**: `expert-rogerio`, `expert-roberto` e
  `expert-amanda`, 800×1000 (4:5), tratados com a mesma receita dos cards
  da dobra 2 — dessaturados, puxados pro quente e com a metade de baixo
  caindo pro escuro, que é onde nome e bio entram. Para somar um expert,
  copiar um `<li class="expert">` no trilho; o carrossel se ajusta sozinho
  e as setas só aparecem quando algum card fica fora da tela. Para destacar
  um card: somar `expert--destaque` e abrir o `<p class="expert__selo">`.
- **Depoimentos (dobra 6)**: cinco vídeos verticais hospedados no YouTube.
  O card não carrega o player: carrega a capa em webp e monta o `<iframe>`
  só no clique, já tocando. Cinco iframes no carregamento custariam mais
  que o resto da página somado, e a maioria das visitas não assiste a
  nenhum. O embed sai pelo domínio `youtube-nocookie.com`.

  O id do vídeo fica no `data-yt` do botão, e a capa em
  `destrave/assets/img/depo-N.webp`. As capas vieram de
  `i.ytimg.com/vi/<id>/oardefault.jpg`, que é a única variante que entrega
  o quadro vertical inteiro: `maxresdefault` devolve 1280x720 com fundo
  borrado nas laterais e cortaria a pessoa.

  Somar depoimento é copiar um `<li class="depo">`, trocar `data-yt`, a
  capa e o nome. A fita se ajusta sozinha e as setas só aparecem quando
  algum card fica fora da tela.

  | # | vídeo | quem |
  |---|-------|------|
  | 01 | `iTaWHYQysAk` | nome a confirmar |
  | 02 | `KEMyKEvRkw4` | Paulo Colombo, ginecologista |
  | 03 | `-adSMKjG6oc` | Matheus, arquiteto |
  | 04 | `wob_LssQQ5o` | Dra. Patrícia Sanches, médica |
  | 05 | `MZHvsHiOvp0` | nome a confirmar |

- **Foto da hero**: o original `background-hero.png` (2,5 MB) fica no repositório
  como fonte, mas quem vai ao ar são as versões WebP `hero-760`, `hero-1200` e
  `hero-1920`, servidas por media query no CSS (128 KB na maior). Ao trocar a
  foto, gerar as três novamente.
- **Vídeo da hero**: `destrave/assets/video/hero-vsl.mp4`, com o pôster em
  `destrave/assets/img/vsl-poster.webp`. O `<video>` nasce com `preload="none"` e sem
  controles, então até o clique o que existe na tela é só o pôster e o peso
  do vídeo fica fora do carregamento da página.

  O arquivo que o cliente mandou tinha 157 MB em **HEVC 10 bits**, e HEVC
  não toca no Chrome do Android nem no Firefox, que é de onde vem o tráfego
  de anúncio. Foi transcodificado para H.264 8 bits, que toca em tudo:

  ```
  ffmpeg -i original.mp4 -vf "scale=1280:720:flags=lanczos" \
    -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset slow \
    -c:a aac -b:a 112k -ac 2 -movflags +faststart destrave/assets/video/hero-vsl.mp4
  ```

  Resultado: 30,8 MB, 1,2 Mbps, sem diferença visível (PSNR de 39,4 dB
  contra a versão em CRF 23, que dava 44,5 MB). O `+faststart` põe o índice
  do arquivo na frente, o que faz o vídeo começar a tocar durante o
  download em vez de depois dele. Ao trocar o vídeo, repetir o comando e
  gerar o pôster novo com `-ss <segundo> -frames:v 1`.
- **Imagem de compartilhamento**: `og-image.jpg` (1200×630, 82 KB) é o que
  aparece na prévia de link do WhatsApp, Instagram e Facebook. Foi recortada
  de `background-hero.png`. JPEG de propósito: WebP falha na prévia de alguns
  aplicativos. Ao trocar, manter o nome, a proporção 1,91:1 e o formato — e
  rodar o *Sharing Debugger* do Facebook pra limpar o cache da prévia antiga.

## Onde ajustar a identidade visual

Cores, fontes e escala tipográfica ficam em `:root`, no topo de
`destrave/assets/css/style.css`. Trocar ali reflete na página inteira.

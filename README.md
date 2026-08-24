# Destrave

Landing page estática (HTML + CSS + JS puro, sem build) com formulário.

## Estrutura

```
.
├── index.html            página do evento
├── obrigado.html         destino do formulário, com o botão de WhatsApp
├── assets/
│   ├── css/style.css     tokens de design + estilos
│   ├── js/main.js        scripts (sem dependências)
│   ├── img/              imagens, logo, favicon, og-image
│   └── fonts/            fontes locais (@font-face)
├── .gitignore
├── .editorconfig
└── README.md
```

## Por que sem build

O deploy por Git da Hostinger apenas copia os arquivos do repositório para
`public_html`. Não roda `npm install` nem `npm run build`. Por isso o projeto
entrega HTML/CSS/JS finais direto na raiz — o que está no repo é o que vai ao ar.

## Rodar localmente

Abrir `index.html` no navegador já funciona. Para um servidor local:

```bash
python -m http.server 8000
```

## Prévia no GitHub Pages

Enquanto o domínio não entra, a avaliação visual roda em
`https://agenciagapper.github.io/destrave/`, servido da branch `main` na
raiz. O arquivo vazio `.nojekyll` desliga o processamento Jekyll, que não
serve pra nada num site sem build e ignora caminhos começados com
underline.

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

A página vai ao ar em **https://rmaeducacao.com.br/destrave/** — subpasta do
domínio, não a raiz. Antes deste ajuste o deploy publicava na raiz, e é de lá
que os arquivos precisam sair (ver *Se o repositório já estava publicando na
raiz*, abaixo). Depois da mudança a raiz fica vazia até receber o site
principal da RMA; se demorar, vale um `index.html` de uma linha em
`public_html` redirecionando pra `/destrave/`, pra quem chegar por um link
antigo não bater num 404.

Todos os caminhos do projeto são relativos (`assets/css/style.css` no HTML,
`../img/hero-1200.webp` no CSS), então a página funciona em qualquer pasta
sem alteração de código. O que é absoluto e aponta pro endereço final são as
três metatags de `index.html`: `canonical`, `og:image` e `og:url`. Se a URL
mudar, mudar as três juntas.

Acessar `rmaeducacao.com.br/destrave` sem a barra final funciona: o servidor
redireciona pra versão com barra antes de servir o `index.html`.

## Deploy na Hostinger (Git)

1. Criar o repositório privado no GitHub e enviar o código.
2. hPanel → **Site** → **Avançado** → **Git**.
3. Em *Criar novo repositório*: colar a URL do repo, branch `main`, e no
   campo de diretório escrever **`destrave`**. É esse campo que define a
   subpasta — a Hostinger cria `public_html/destrave` e copia o repositório
   pra lá, o que serve a página em `rmaeducacao.com.br/destrave/`. Em branco,
   publicaria na raiz e sobrescreveria o site principal.
4. Repo privado: copiar a **chave SSH pública** que a Hostinger exibe e
   cadastrá-la no GitHub em *Settings → Deploy keys* do repositório.
5. Cada atualização: botão **Deploy** no hPanel, ou configurar o **webhook**
   que a Hostinger fornece em *Settings → Webhooks* do GitHub para deploy
   automático a cada push.

### Se o repositório já estava publicando na raiz

A Hostinger não move arquivos ao trocar o diretório de um deploy existente,
e não dá pra ter dois deploys apontando pra pastas diferentes com o mesmo
repositório. O caminho é:

1. hPanel → **Git**: remover o deploy antigo (isso só desconecta o repo, não
   apaga nada de `public_html`).
2. Gerenciador de arquivos: apagar de `public_html` o que veio deste
   repositório — `index.html`, a pasta `assets/` e o `.nojekyll` — sem
   encostar em nada mais que esteja lá.
3. Criar o deploy de novo com o diretório `destrave`, seguindo os passos
   acima, e rodar **Deploy**.
4. Conferir `https://rmaeducacao.com.br/destrave/` — a página carrega com
   imagens e fontes, e sem a barra final o servidor redireciona sozinho.

### Se a subpasta der 404 ou cair no site principal

Um `.htaccess` na raiz pode estar capturando a URL antes de o Apache achar a
pasta. As regras padrão do WordPress não fazem isso — elas só reescrevem o
que não é arquivo nem diretório existente —, mas redirecionamentos manuais
e plugins de cache fazem. Conferindo pela ordem: a pasta `public_html/destrave`
existe e tem `index.html` dentro; o `.htaccess` da raiz não tem `RewriteRule`
sem as condições `!-f` / `!-d`; e nenhum plugin de redirecionamento pega
`/destrave`.

## Dobra de oferta e captação

A dobra 7 (`.oferta`, âncora `#formulario`) fecha a página com dois cards
claros: a lista do que está incluído e o card de preço. O número do preço
sai borrado por `filter: blur()` no CSS, com o `R$` nítido ao lado. O borrão
é gesto visual, não segurança: o valor está no HTML e aparece pra quem abrir
o inspetor. Se em algum momento ele não puder vazar, o caminho é tirar o
número do HTML e injetá-lo só depois da conversão.

O CTA abre o modal de captação. Qualquer elemento com `data-abrir-modal`
abre o mesmo modal, então dá pra somar um CTA em outra dobra sem tocar no JS.

### O que trocar quando a campanha muda

Tudo o que é volátil está no objeto `CONFIG`, no topo de `assets/js/main.js`:

- `webhook` — para onde o lead é enviado. Hoje aponta pro cenário do Make.
  Se ficar vazio, o formulário valida, pula o envio e vai direto pra página
  de obrigado: a página continua funcionando, mas nenhum lead é gravado.
- `waFone` e `waMsg` — o WhatsApp de destino, em formato internacional e só
  dígitos, e a mensagem que já vem escrita pro lead.
- `obrigado` — o arquivo de destino após o envio.

O preço fica em `index.html`, no `<span class="preco__num">`. A data e a
cidade da pílula da dobra 7 repetem as da hero e mudam junto com elas
(ver *Data do evento*).

### O que o lead carrega

O envio monta um JSON com os seis campos do formulário, mais `utm_source`,
`utm_medium`, `utm_campaign`, `utm_content`, `utm_term` e `referrer`, lidos
da URL na hora que a página abre. Vão junto o WhatsApp já normalizado em
`whatsapp_digitos` (com o 55 na frente, pronto pra discagem), o horário do
envio, a URL e o título da página.

O POST sai como `text/plain` de propósito: é um dos tipos que o navegador
libera sem *preflight* de CORS, e os webhooks de automação parseiam o corpo
como JSON do mesmo jeito. Se o webhook demorar, o lead não fica preso: o
redirecionamento acontece na resposta ou em 2,5 segundos, o que vier antes.

O POST foi testado contra o cenário do Make com o payload exato que o
navegador monta: resposta `200 Accepted` e cabeçalho
`access-control-allow-origin: *`, que é o que o `fetch` precisa pra rodar
a partir do domínio sem ser barrado.

### Página de obrigado

`obrigado.html` é uma página separada, fora do índice de busca
(`noindex, nofollow`), com o botão verde que abre a conversa no WhatsApp.
As UTMs seguem na query string, e o primeiro nome de quem preencheu chega
por `sessionStorage` pra saudação. Sem esse dado a frase fecha sozinha, o
que cobre quem abre a URL direto.

## Dúvidas frequentes e rodapé

A dobra 8 (`.faq`) usa `<details>` e `<summary>` puros: abre e fecha sem
JS nenhum, e o leitor de tela anuncia expandido ou recolhido sozinho, sem
`aria-expanded` na mão. O ícone é um mais que gira 45 graus e vira um xis
quando o item abre. Somar pergunta é copiar um `.faq__item`.

As seis perguntas e respostas vieram da página
`rogeriomagalhaes.com/destrave-sua-comunicacao-v3`, a pedido do cliente.
A única alteração foi a data: lá está a edição de março de 2026, e aqui
vale a data desta página, setembro. As duas precisam mudar juntas quando
a data mudar (ver *Data do evento*).

O rodapé fecha com a logo, a linha do evento, o botão de contato no
WhatsApp (mesmo número e mesma mensagem do resto da página, montados pelo
`CONFIG`) e o copyright.

## Data do evento

Aparece em dois lugares e os dois precisam ser alterados juntos:

- `index.html`, atributo `data-deadline` do bloco `#countdown` (formato ISO com
  fuso, ex. `2026-09-12T19:00:00-03:00`) — alimenta a contagem regressiva.
- `index.html`, parágrafo `.hero__when` — data e cidade exibidas na hero.
- `index.html`, pílula `.oferta__meta` da dobra 7.
- `index.html`, resposta da pergunta *Quais são os dias e os horários* na
  dobra 8, e a linha `.rodape__evento`.

## Copy pendente de confirmação

Trechos que não vieram do cliente e ainda precisam do aval dele:

- **Dobra 5, campo "assunto" dos experts** (`.expert__assunto`):
  *Comunicação estratégica*, *Liderança e oratória* e *Comunicação
  corporativa* foram derivados das próprias bios, não informados. O tema
  real de cada bloco pode ser outro.
- **Dobra 5, segundo destaque**: só o card do Rogério está marcado. Falta
  definir qual é o segundo e o texto do selo.
- **Dobra 6, título e linha de apoio**: escritos aqui. A linha de apoio
  afirma que todos os depoentes terminaram o domingo no palco; se algum
  dos oito vídeos não for de quem subiu, a frase precisa mudar.
- **Dobra 7, selo do card de preço**: está escrito *Vagas limitadas*, que
  é o que a barra fixa já diz. Se existir lote com percentual de desconto
  definido, é aqui que ele entra, no lugar do selo atual.
- **Dobra 8, horários do evento**: a pergunta é *Quais são os dias e os
  horários*, e a resposta herdada da página de origem só dá os dias. Está
  respondida com a data e as 20+ horas de imersão; se existir grade com
  horário de início e término, é aqui que ela entra.
- **Dobra 7, condição de pagamento**: a referência que originou esta dobra
  mostra parcelamento e barra de vagas preenchidas. Ficaram de fora porque
  nenhum dos dois foi informado, e número de vaga preenchida sem base é o
  tipo de dado que o público checa. Havendo parcelamento real, ele cabe
  entre a nota e o botão.

## Assets

- **Fontes** ficam em `assets/fonts/` e são carregadas por `@font-face` local,
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
- **Depoimentos (dobra 6)**: os oito pôsteres ainda são espaço reservado —
  degradês da paleta com número, play e duração, sem arquivo de imagem.
  Quando os vídeos chegarem, trocar o conteúdo de `.depo__poster` pelo
  player (ou por uma capa em `<img>` mais um modal), mantendo a proporção
  9:16 e o texto de `.depo__nome` / `.depo__trava`. Se os vídeos vierem
  na horizontal, mudar o `aspect-ratio` de `.depo__poster` e a largura de
  `.depo` resolve — o resto da fita se ajusta.
- **Foto da hero**: o original `background-hero.png` (2,5 MB) fica no repositório
  como fonte, mas quem vai ao ar são as versões WebP `hero-760`, `hero-1200` e
  `hero-1920`, servidas por media query no CSS (128 KB na maior). Ao trocar a
  foto, gerar as três novamente.
- **Imagem de compartilhamento**: `og-image.jpg` (1200×630, 82 KB) é o que
  aparece na prévia de link do WhatsApp, Instagram e Facebook. Foi recortada
  de `background-hero.png`. JPEG de propósito: WebP falha na prévia de alguns
  aplicativos. Ao trocar, manter o nome, a proporção 1,91:1 e o formato — e
  rodar o *Sharing Debugger* do Facebook pra limpar o cache da prévia antiga.

## Onde ajustar a identidade visual

Cores, fontes e escala tipográfica ficam em `:root`, no topo de
`assets/css/style.css`. Trocar ali reflete na página inteira.

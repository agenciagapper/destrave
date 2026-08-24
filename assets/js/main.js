/* ============================================================
   DESTRAVE — scripts da página
   Sem dependências externas: o deploy da Hostinger via Git
   publica os arquivos como estão, sem etapa de build.
   ============================================================ */
(function () {
  'use strict';

  /* Marca que o JS rodou: o CSS só esconde os blocos com data-reveal
     quando esta classe existe, então sem JS nada some da página. */
  document.documentElement.classList.add('js');

  /* ---------- Contagem regressiva da barra fixa ----------
     A data alvo vem do atributo data-deadline no HTML,
     em formato ISO com fuso: 2026-09-12T19:00:00-03:00
  --------------------------------------------------------- */
  var countdown = document.getElementById('countdown');

  if (countdown) {
    var deadline = new Date(countdown.dataset.deadline).getTime();
    var fields = {
      days: countdown.querySelector('[data-unit="days"]'),
      hours: countdown.querySelector('[data-unit="hours"]'),
      minutes: countdown.querySelector('[data-unit="minutes"]'),
      seconds: countdown.querySelector('[data-unit="seconds"]')
    };

    var pad = function (n) {
      return String(n).padStart(2, '0');
    };

    var render = function () {
      var left = deadline - Date.now();

      if (isNaN(deadline)) {
        countdown.hidden = true;
        return true;
      }

      if (left <= 0) {
        fields.days.textContent = '00';
        fields.hours.textContent = '00';
        fields.minutes.textContent = '00';
        fields.seconds.textContent = '00';
        return true;
      }

      var totalSeconds = Math.floor(left / 1000);
      fields.days.textContent = pad(Math.floor(totalSeconds / 86400));
      fields.hours.textContent = pad(Math.floor(totalSeconds / 3600) % 24);
      fields.minutes.textContent = pad(Math.floor(totalSeconds / 60) % 60);
      fields.seconds.textContent = pad(totalSeconds % 60);
      return false;
    };

    if (!render()) {
      var timer = setInterval(function () {
        if (render()) clearInterval(timer);
      }, 1000);
    }
  }

  /* ---------- Entrada dos blocos ao entrar na tela ---------- */
  var pendentes = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));

  if (pendentes.length) {
    pendentes.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 90 + 'ms';
    });

    var agendado = false;

    var revelar = function () {
      agendado = false;
      var limite = window.innerHeight * 0.88;

      pendentes = pendentes.filter(function (el) {
        if (el.getBoundingClientRect().top > limite) return true;
        el.classList.add('is-visible');
        return false;
      });

      if (!pendentes.length) {
        window.removeEventListener('scroll', agendar);
        window.removeEventListener('resize', agendar);
      }
    };

    var agendar = function () {
      if (agendado) return;
      agendado = true;
      window.setTimeout(revelar, 60);
    };

    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    revelar();
  }

  /* ---------- Carrossel dos experts ----------
     Trilho com scroll nativo e snap: o arraste e o teclado já funcionam
     sem JS. Aqui só entram as setas, que aparecem apenas quando existe
     card fora da tela.
  --------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-carrossel]'), function (carrossel) {
    var trilho = carrossel.querySelector('.carrossel__trilho');
    var nav = carrossel.querySelector('.carrossel__nav');
    if (!trilho || !nav) return;

    var botoes = Array.prototype.slice.call(nav.querySelectorAll('[data-dir]'));

    var passo = function () {
      var card = trilho.querySelector('li');
      if (!card) return trilho.clientWidth;
      var gap = parseFloat(getComputedStyle(trilho).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };

    var sobra = function () {
      return trilho.scrollWidth - trilho.clientWidth;
    };

    var atualizar = function () {
      var excedente = sobra() > 4;
      nav.hidden = !excedente;
      if (!excedente) return;
      var x = trilho.scrollLeft;
      botoes[0].disabled = x <= 2;
      botoes[1].disabled = x >= sobra() - 2;
    };

    botoes.forEach(function (botao) {
      botao.addEventListener('click', function () {
        var suave = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        trilho.scrollBy({
          left: passo() * Number(botao.dataset.dir),
          behavior: suave ? 'smooth' : 'auto'
        });
      });
    });

    trilho.addEventListener('scroll', atualizar, { passive: true });
    window.addEventListener('resize', atualizar);
    atualizar();
  });

  /* ============================================================
     CONFIG — o que muda quando a campanha muda
     ============================================================ */
  var CONFIG = {
    /* Para onde o lead é enviado (Make, Zapier, n8n, RD, o que for).
       Vazio: o formulário pula o envio e vai direto pro obrigado,
       então a página funciona antes da automação existir. */
    webhook: '',

    /* WhatsApp de destino, em formato internacional e só dígitos. */
    waFone: '5511917066626',
    waMsg: 'Olá, vim do site e quero saber mais sobre o Destrave.',

    obrigado: 'obrigado.html'
  };

  /* ---------- Modal de captação ---------- */
  var modal = document.getElementById('modal-lead');
  var form = document.getElementById('form-lead');

  if (modal && form) {
    var card = modal.querySelector('.modal__card');
    var erro = document.getElementById('lead-erro');
    var enviar = form.querySelector('[type="submit"]');
    var focoAnterior = null;

    /* ----- Origem do lead: UTMs da URL e referrer ----- */
    var params = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (chave) {
      var campo = form.querySelector('[name="' + chave + '"]');
      if (campo) campo.value = params.get(chave) || '';
    });
    var refer = form.querySelector('[name="referrer"]');
    if (refer) refer.value = document.referrer || '';

    /* ----- Máscara do WhatsApp: (11) 91234-5678 ----- */
    var fone = document.getElementById('lead-whatsapp');

    var mascara = function (valor) {
      var d = (valor || '').replace(/\D/g, '').slice(0, 11);
      if (!d) return '';
      if (d.length <= 2) return '(' + d;
      if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
      return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
    };

    if (fone) {
      fone.addEventListener('input', function (ev) {
        var alvo = ev.target;
        var antes = alvo.value.length;
        var cursor = alvo.selectionStart;
        alvo.value = mascara(alvo.value);
        /* Reposiciona o cursor pelo delta: sem isso, editar no meio do
           número joga o cursor pro fim a cada tecla. */
        var delta = alvo.value.length - antes;
        try { alvo.setSelectionRange(cursor + delta, cursor + delta); } catch (e) {}
      });
      /* Autofill do navegador entra sem disparar input. */
      if (fone.value) fone.value = mascara(fone.value);
    }

    /* ----- Abrir e fechar ----- */
    var focaveis = function () {
      return Array.prototype.filter.call(
        card.querySelectorAll('a[href], button, input, select, textarea'),
        function (el) { return !el.disabled && el.offsetParent !== null; }
      );
    };

    var abrir = function () {
      focoAnterior = document.activeElement;
      modal.hidden = false;
      document.body.classList.add('modal-aberto');
      window.setTimeout(function () {
        var primeiro = form.querySelector('[name="nome"]');
        if (primeiro) primeiro.focus();
      }, 60);
    };

    var fechar = function () {
      modal.hidden = true;
      document.body.classList.remove('modal-aberto');
      if (focoAnterior && focoAnterior.focus) focoAnterior.focus();
    };

    Array.prototype.forEach.call(document.querySelectorAll('[data-abrir-modal]'), function (botao) {
      botao.addEventListener('click', function (ev) {
        ev.preventDefault();
        abrir();
      });
    });

    modal.addEventListener('click', function (ev) {
      if (ev.target.closest('[data-fechar-modal]')) fechar();
    });

    document.addEventListener('keydown', function (ev) {
      if (modal.hidden) return;

      if (ev.key === 'Escape') {
        fechar();
        return;
      }

      /* Prende o Tab dentro do card enquanto o modal está aberto. */
      if (ev.key !== 'Tab') return;
      var lista = focaveis();
      if (!lista.length) return;
      var primeiro = lista[0];
      var ultimo = lista[lista.length - 1];

      if (ev.shiftKey && document.activeElement === primeiro) {
        ev.preventDefault();
        ultimo.focus();
      } else if (!ev.shiftKey && document.activeElement === ultimo) {
        ev.preventDefault();
        primeiro.focus();
      }
    });

    /* ----- Validação ----- */
    var soDigitos = function (v) { return (v || '').replace(/\D/g, ''); };

    var validar = function () {
      var invalidos = Array.prototype.filter.call(
        form.querySelectorAll('[required]'),
        function (campo) { return !campo.value.trim(); }
      );

      var email = form.querySelector('[name="email"]');
      if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) {
        if (invalidos.indexOf(email) < 0) invalidos.push(email);
      }

      /* 10 dígitos (fixo) ou 11 (celular), já com DDD. */
      if (fone && fone.value.trim()) {
        var n = soDigitos(fone.value).length;
        if (n < 10 && invalidos.indexOf(fone) < 0) invalidos.push(fone);
      }

      Array.prototype.forEach.call(form.querySelectorAll('.is-invalido'), function (campo) {
        campo.classList.remove('is-invalido');
      });
      invalidos.forEach(function (campo) { campo.classList.add('is-invalido'); });

      return invalidos;
    };

    form.addEventListener('input', function (ev) {
      if (ev.target.classList.contains('is-invalido') && ev.target.value.trim()) {
        ev.target.classList.remove('is-invalido');
      }
    });

    /* ----- Envio ----- */
    var irProObrigado = function (nome) {
      try { window.sessionStorage.setItem('destrave:nome', nome || ''); } catch (e) {}
      /* Leva as UTMs adiante pra página de obrigado medir a mesma origem. */
      window.location.href = CONFIG.obrigado + window.location.search;
    };

    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      var invalidos = validar();
      if (invalidos.length) {
        erro.textContent = 'Confira os campos destacados antes de enviar.';
        erro.hidden = false;
        invalidos[0].focus();
        return;
      }

      erro.hidden = true;
      enviar.disabled = true;
      enviar.textContent = 'Enviando...';

      var dados = {};
      new FormData(form).forEach(function (valor, chave) { dados[chave] = valor; });
      dados.whatsapp_digitos = '55' + soDigitos(dados.whatsapp);
      dados.enviado_em = new Date().toISOString();
      dados.pagina = window.location.href;
      dados.titulo = document.title;

      var nome = dados.nome;

      if (!CONFIG.webhook) {
        irProObrigado(nome);
        return;
      }

      /* text/plain evita o preflight do CORS: a maioria dos webhooks de
         automação aceita o JSON no corpo mesmo com esse Content-Type.
         O lead nunca fica preso aqui: o redirecionamento acontece na
         resposta ou no estouro do timeout, o que vier primeiro. */
      var seguiu = false;
      var seguir = function () {
        if (seguiu) return;
        seguiu = true;
        irProObrigado(nome);
      };

      window.setTimeout(seguir, 2500);

      try {
        fetch(CONFIG.webhook, {
          method: 'POST',
          mode: 'cors',
          credentials: 'omit',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          body: JSON.stringify(dados),
          keepalive: true
        }).then(seguir)['catch'](seguir);
      } catch (e) {
        seguir();
      }
    });
  }

  /* ---------- Link do WhatsApp (aqui e na página de obrigado) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-whatsapp]'), function (link) {
    link.href = 'https://wa.me/' + CONFIG.waFone +
                '?text=' + encodeURIComponent(CONFIG.waMsg);
  });

  /* ---------- Saudação da página de obrigado ---------- */
  var saudacao = document.querySelector('[data-nome-lead]');

  if (saudacao) {
    var salvo = '';
    try { salvo = window.sessionStorage.getItem('destrave:nome') || ''; } catch (e) {}
    var primeiroNome = salvo.trim().split(/\s+/)[0];
    if (primeiroNome) saudacao.textContent = ', ' + primeiroNome;
  }
})();

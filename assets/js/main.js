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

  /* Espaço reservado para a lógica do formulário (próxima etapa). */
})();

/* Liga ForDoctor: comportamento da LP. Vanilla, carregado com defer.
   Regra geral: sem JS todo o conteúdo aparece; com movimento reduzido tudo nasce no estado final;
   só arma animação no que ainda está abaixo da dobra. */
(function () {
  'use strict';

  var doc = document;
  var raiz = doc.documentElement;
  var PREVIEW = raiz.hasAttribute('data-preview');
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  var temIO = 'IntersectionObserver' in window;
  var semMovimento = function () { return reduzido.matches || !temIO; };
  var abaixoDaDobra = function (el) { return el.getBoundingClientRect().top > window.innerHeight; };
  var naoFaz = function () {};

  /* 1. Cabeçalho: só o fundo muda depois da rolagem (sentinela, sem listener de scroll) */
  (function cabecalho() {
    var topo = doc.querySelector('[data-topo]');
    if (!topo || !temIO) return;
    var sentinela = doc.createElement('div');
    sentinela.setAttribute('aria-hidden', 'true');
    sentinela.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:12px;pointer-events:none';
    doc.body.insertBefore(sentinela, doc.body.firstChild);
    new IntersectionObserver(function (entradas) {
      topo.classList.toggle('topo--rolado', !entradas[0].isIntersecting);
    }).observe(sentinela);
  })();

  /* 2. CTA fixo no celular: aparece depois do botão do hero e some quando o formulário está na tela */
  (function ctaFixo() {
    var barra = doc.querySelector('[data-cta-fixo]');
    var ctaHero = doc.querySelector('[data-cta-hero]');
    var cadastro = doc.getElementById('cadastro');
    if (!barra || !ctaHero || !cadastro || !temIO) return;
    var heroPassou = false;
    var cadastroNaTela = false;
    var atualiza = function () { barra.classList.toggle('visivel', heroPassou && !cadastroNaTela); };
    new IntersectionObserver(function (entradas) {
      var e = entradas[0];
      heroPassou = !e.isIntersecting && e.boundingClientRect.top < 0;
      atualiza();
    }).observe(ctaHero);
    new IntersectionObserver(function (entradas) {
      cadastroNaTela = entradas[0].isIntersecting;
      atualiza();
    }, { rootMargin: '0px 0px -10% 0px' }).observe(cadastro);
  })();

  /* 3. Foto do hero: entra quando ela mesma termina de carregar; nunca esconde uma imagem pronta */
  (function fotoHero() {
    var figura = doc.querySelector('[data-foto-hero]');
    var img = figura && figura.querySelector('img');
    if (!img || reduzido.matches) return;
    if (img.complete && img.naturalWidth) return;
    if (raiz.classList.contains('intro-ativa')) return; // com a intro, a dissolução já revela a foto
    figura.classList.add('aguardando');
    var mostra = function () {
      if (!figura.classList.contains('aguardando')) return;
      figura.classList.remove('aguardando');
      figura.classList.add('entrando');
    };
    var libera = function () { figura.classList.remove('aguardando'); };
    img.addEventListener('load', function () {
      if (img.decode) img.decode().then(mostra, mostra); else mostra();
    }, { once: true });
    img.addEventListener('error', libera, { once: true });
    window.addEventListener('pageshow', function () { if (img.complete) mostra(); });
  })();

  /* 3b. Ondas dos anéis do hero: pausam fora da tela e com a aba oculta, sem reiniciar o ciclo */
  (function ondas() {
    var camada = doc.querySelector('[data-ondas]');
    if (!camada || !temIO) return;
    var naTela = true;
    var atualiza = function () { camada.classList.toggle('pausada', !naTela || doc.hidden); };
    new IntersectionObserver(function (entradas) { naTela = entradas[0].isIntersecting; atualiza(); }).observe(camada.parentElement);
    doc.addEventListener('visibilitychange', atualiza);
  })();

  /* 4. Títulos H2 revelados por linha, só abaixo da dobra; o texto existe sem JS */
  (function titulosPorLinha() {
    var titulos = [].slice.call(doc.querySelectorAll('[data-revela]'));
    if (!titulos.length || semMovimento()) return;
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
    var armados = [];

    var restaura = function (item) {
      if (item.feito) return;
      item.feito = true;
      item.el.innerHTML = item.original;
      item.el.classList.remove('revela-armado', 'revela-ativo');
    };

    // Em três passos para o navegador calcular o layout uma vez só: escreve as palavras, lê as posições, escreve as linhas.
    var separaPalavras = function (item) {
      // divide só em espaços comuns: o espaço inseguível mantém palavras juntas, como no título final
      var texto = item.el.textContent.replace(/[ \t\r\n]+/g, ' ').trim();
      item.el.innerHTML = texto.split(' ').map(function (p) { return '<span data-p>' + esc(p) + '</span>'; }).join(' ');
    };
    var leLinhas = function (item) {
      var linhas = [];
      var topoAtual = null;
      [].forEach.call(item.el.querySelectorAll('[data-p]'), function (s) {
        var t = s.offsetTop;
        if (topoAtual === null || Math.abs(t - topoAtual) > 3) { linhas.push([]); topoAtual = t; }
        linhas[linhas.length - 1].push(s.textContent);
      });
      item.grupos = linhas;
      item.linhas = linhas.length;
    };
    var montaLinhas = function (item) {
      item.el.innerHTML = item.grupos.map(function (l, i) {
        return '<span class="linha-mascara"><span class="linha-conteudo" style="--i:' + Math.min(i, 10) + '">' + esc(l.join(' ')) + '</span></span>';
      }).join(' ');
      item.el.classList.add('revela-armado');
    };

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        observador.unobserve(e.target);
        var item = armados.filter(function (a) { return a.el === e.target; })[0];
        if (!item || item.feito) return;
        item.el.classList.add('revela-ativo');
        var total = Math.min(item.linhas * 60, 600) + 600;
        setTimeout(function () { restaura(item); }, total);
      });
    }, { rootMargin: '0px 0px -12% 0px' });

    var arma = function () {
      requestAnimationFrame(function () {
        var novos = titulos.filter(abaixoDaDobra).map(function (el) {
          return { el: el, original: el.innerHTML, feito: false, linhas: 0, grupos: [] };
        });
        novos.forEach(separaPalavras);
        novos.forEach(leLinhas);
        novos.forEach(montaLinhas);
        novos.forEach(function (item) { armados.push(item); observador.observe(item.el); });
      });
    };

    var larguraInicial = window.innerWidth;
    window.addEventListener('resize', function () {
      if (window.innerWidth === larguraInicial) return;
      armados.forEach(restaura);
      observador.disconnect();
    });
    reduzido.addEventListener && reduzido.addEventListener('change', function () { armados.forEach(restaura); });

    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(arma, arma); else arma();
  })();

  /* 5. Sequências desenhadas uma vez ao entrar na tela: a trilha 5 → 10 → 20 (momento principal)
        e os passos da indicação, no estilo da ForDoctor Indica. O fim é o último elemento animado. */
  [['[data-trilha]', '.degrau:last-child .degrau__valor', 'valor-aparece'], ['[data-passos]', '.passo--credito .passo__no', 'pulso']].forEach(function (par) {
    var lista = doc.querySelector(par[0]);
    if (!lista || semMovimento() || !abaixoDaDobra(lista)) return;
    lista.classList.add('armada');
    var ultimo = lista.querySelector(par[1]);
    var naTela = false;
    var terminou = false;
    var conclui = function () {
      if (terminou) return;
      terminou = true;
      lista.classList.remove('armada', 'desenhando', 'pausada');
    };
    var pausa = function () {
      if (!lista.classList.contains('desenhando') || terminou) return;
      lista.classList.toggle('pausada', !naTela || doc.hidden);
    };
    ultimo.addEventListener('animationend', function (e) { if (e.animationName === par[2]) conclui(); });
    // começa com 35% da trilha na tela; só pausa quando ela sai inteira da tela
    new IntersectionObserver(function (entradas) {
      var e = entradas[0];
      naTela = e.isIntersecting;
      if (e.intersectionRatio >= 0.35 && lista.classList.contains('armada') && !lista.classList.contains('desenhando')) {
        lista.classList.add('desenhando');
      }
      pausa();
    }, { threshold: [0, 0.35] }).observe(lista);
    doc.addEventListener('visibilitychange', pausa);
    reduzido.addEventListener && reduzido.addEventListener('change', conclui);
  });

  /* 6. Foto de "O que é a Liga" revelada por máscara curta, com espaço reservado */
  (function imagemComMascara() {
    var figura = doc.querySelector('[data-revela-imagem]');
    var img = figura && figura.querySelector('img');
    if (!img || semMovimento() || !abaixoDaDobra(figura)) return;
    figura.classList.add('armada');
    var visivel = false;
    var limpa = function () { figura.classList.remove('armada', 'revelada'); };
    var revela = function () {
      if (!visivel || !(img.complete && img.naturalWidth)) return;
      figura.classList.remove('armada');
      figura.classList.add('revelada');
      setTimeout(limpa, 1200);
    };
    img.addEventListener('load', revela, { once: true });
    img.addEventListener('error', limpa, { once: true });
    var obs = new IntersectionObserver(function (entradas) {
      if (!entradas[0].isIntersecting) return;
      visivel = true;
      obs.disconnect();
      revela();
    }, { rootMargin: '0px 0px -10% 0px' });
    obs.observe(figura);
    // com o recorte fechado o navegador não dispara o lazy-load sozinho: pedimos a imagem quando a seção se aproxima
    var perto = new IntersectionObserver(function (entradas) {
      if (!entradas[0].isIntersecting) return;
      perto.disconnect();
      if (img.loading === 'lazy' && !img.currentSrc) img.loading = 'eager';
    }, { rootMargin: '0px 0px 900px 0px' });
    perto.observe(figura);
    reduzido.addEventListener && reduzido.addEventListener('change', limpa);
  })();

  /* 6b. Parallax dos anéis: a camada azul de "O que a Liga oferece?" e a clara das recompensas andam juntas,
         mais devagar que a página, e por isso continuam alinhadas na divisa entre as duas seções.
         y = A × (2p − 1), com p = progresso da faixa das recompensas (que não se move) atravessando a tela. */
  (function parallaxDosAneis() {
    var camadas = [].slice.call(doc.querySelectorAll('[data-parallax]'));
    var faixa = doc.getElementById('recompensas');
    if (!camadas.length || !faixa || semMovimento()) return;
    var perto = false;
    var pedido = 0;
    var quadro = function () {
      pedido = 0;
      var r = faixa.getBoundingClientRect();                 // lê tudo antes de escrever
      var vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
      var amplitude = Math.max(24, Math.min(90, window.innerWidth * 0.06));
      var y = (amplitude * (2 * p - 1)).toFixed(1);
      camadas.forEach(function (c) { c.style.translate = '0 ' + y + 'px'; });
    };
    var agenda = function () { if (perto && !pedido) pedido = requestAnimationFrame(quadro); };
    new IntersectionObserver(function (entradas) {
      perto = entradas[0].isIntersecting;
      agenda();
    }, { rootMargin: '100% 0px' }).observe(faixa);
    window.addEventListener('scroll', agenda, { passive: true });
    window.addEventListener('resize', agenda);
    reduzido.addEventListener && reduzido.addEventListener('change', function () {
      if (!reduzido.matches) return;
      perto = false;
      camadas.forEach(function (c) { c.style.translate = ''; });
    });
  })();

  /* 7. Formulário: UTM, máscara do WhatsApp, validação em português e estados de envio */
  (function formulario() {
    var form = doc.querySelector('[data-formulario]');
    if (!form) return;
    form.noValidate = true;

    var botao = form.querySelector('[data-enviar]');
    var rotulo = form.querySelector('[data-enviar-texto]');
    var status = form.querySelector('[data-status]');
    var painelSucesso = doc.querySelector('[data-sucesso]');
    var whatsapp = form.querySelector('[data-whatsapp]');
    var TEXTO_BOTAO = rotulo.textContent;
    var URL_OBRIGADO = 'https://fordoctor.com.br/liga-fordoctor/obrigado/';
    var WHATSAPP_FORDOCTOR = '(31) 99712-5537';

    // UTM: mesma chave que o site já usa; parâmetros da URL atual substituem os guardados
    (function utm() {
      var CHAVE = 'queryParams';
      var guardados = {};
      try { guardados = JSON.parse(sessionStorage.getItem(CHAVE) || '{}') || {}; } catch (e) { guardados = {}; }
      var atuais = {};
      var temAtuais = false;
      new URLSearchParams(location.search).forEach(function (valor, chave) {
        if (chave && valor !== '') { atuais[chave] = valor; temAtuais = true; }
      });
      var params = temAtuais ? atuais : guardados;
      if (temAtuais) { try { sessionStorage.setItem(CHAVE, JSON.stringify(atuais)); } catch (e) { naoFaz(); } }
      ['utm_source', 'utm_medium', 'utm_campaign'].forEach(function (k) {
        var campo = form.querySelector('[name="form_fields[' + k + ']"]');
        if (campo && params[k]) campo.value = params[k];
      });
    })();

    // Máscara brasileira: (31) 99999-9999
    var formataTelefone = function (valor) {
      var d = valor.replace(/\D/g, '');
      if (d.length > 11 && d.indexOf('55') === 0) d = d.slice(2);
      if (d.charAt(0) === '0') d = d.slice(1);
      d = d.slice(0, 11);
      if (d.length > 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
      if (d.length > 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
      if (d.length > 2) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
      if (d.length) return '(' + d;
      return '';
    };
    if (whatsapp) {
      whatsapp.addEventListener('input', function () {
        var noFim = whatsapp.selectionStart === whatsapp.value.length;
        if (noFim) whatsapp.value = formataTelefone(whatsapp.value);
      });
      whatsapp.addEventListener('blur', function () { whatsapp.value = formataTelefone(whatsapp.value); });
    }

    var regras = {
      'form_fields[first_namae]': function (v) { return v.trim().length >= 2 ? '' : 'Escreva seu nome.'; },
      'form_fields[last_name]': function (v) { return v.trim().length >= 2 ? '' : 'Escreva seu sobrenome.'; },
      'form_fields[email]': function (v) {
        v = v.trim();
        if (!v) return 'Escreva seu e-mail.';
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Confira o e-mail. Exemplo: nome@email.com';
      },
      'form_fields[field_f2695ae]': function (v) {
        var d = v.replace(/\D/g, '');
        if (!d) return 'Escreva seu WhatsApp com DDD.';
        return /^[1-9]{2}9\d{8}$/.test(d) ? '' : 'Confira o WhatsApp: use o DDD e o número do celular, como (31) 99999-9999.';
      },
      'form_fields[periodo]': function (v) { return v ? '' : 'Escolha o seu período.'; }
    };

    var campoErro = function (campo) { return doc.getElementById('erro-' + campo.id.replace('form-field-', '')); };
    var valida = function (campo, mostrar) {
      var regra = regras[campo.name];
      if (!regra) return true;
      var msg = regra(campo.value);
      var alvo = campoErro(campo);
      if (mostrar || campo.getAttribute('aria-invalid') === 'true') {
        campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (alvo) alvo.textContent = msg;
      }
      return !msg;
    };

    [].forEach.call(form.querySelectorAll('input:not([type=hidden]), select'), function (campo) {
      campo.addEventListener('blur', function () { if (campo.value) valida(campo, true); });
      campo.addEventListener('input', function () { valida(campo, false); });
      campo.addEventListener('change', function () { valida(campo, campo.tagName === 'SELECT'); });
    });

    var estado = function (nome) {
      form.setAttribute('data-estado', nome);
      var ocupado = nome === 'enviando' || nome === 'enviado';
      botao.disabled = ocupado;
      botao.setAttribute('aria-busy', nome === 'enviando' ? 'true' : 'false');
      if (nome === 'enviando') rotulo.textContent = 'Enviando…';
      else if (nome === 'enviado') rotulo.textContent = 'Cadastro recebido ✓';
      else rotulo.textContent = TEXTO_BOTAO;
    };

    // Pré-visualização: simula o envio sem mandar nada. Use ?erro=1 na URL para ver o estado de erro.
    var simula = function () {
      return new Promise(function (ok, falha) {
        setTimeout(function () {
          if (/[?&]erro=1\b/.test(location.search)) falha(new Error('simulado')); else ok();
        }, 1100);
      });
    };
    // Produção (Fase 3): enviar para o mesmo destino do formulário do Elementor e redirecionar para a página de obrigado.
    var enviaWordPress = function () { return Promise.reject(new Error('integração com o WordPress ainda não configurada')); };

    form.addEventListener('submit', function (evento) {
      evento.preventDefault();
      if (form.getAttribute('data-estado') === 'enviando') return;
      var primeiroInvalido = null;
      [].forEach.call(form.querySelectorAll('input:not([type=hidden]), select'), function (campo) {
        if (!valida(campo, true) && !primeiroInvalido) primeiroInvalido = campo;
      });
      if (primeiroInvalido) {
        status.className = 'formulario__status erro';
        status.textContent = 'Confira os campos destacados para enviar seu cadastro.';
        primeiroInvalido.focus();
        return;
      }
      status.className = 'formulario__status';
      status.textContent = '';
      estado('enviando');
      (PREVIEW ? simula() : enviaWordPress(new FormData(form))).then(function () {
        estado('enviado');
        setTimeout(function () {
          if (!PREVIEW) { window.location.href = URL_OBRIGADO; return; }
          form.hidden = true;
          painelSucesso.hidden = false;
          painelSucesso.focus();
        }, 900);
      }, function () {
        estado('erro');
        status.className = 'formulario__status erro';
        status.textContent = 'Não foi possível enviar seu cadastro agora. Tente de novo em alguns instantes ou fale com a ForDoctor pelo WhatsApp ' + WHATSAPP_FORDOCTOR + '.';
      });
    });
  })();
})();

/* Liga ForDoctor: comportamento da LP. Vanilla, carregado com defer.
   Regra geral: sem JS todo o conteúdo aparece; com movimento reduzido tudo nasce no estado final;
   o que está na tela no carregamento não é escondido; os efeitos de entrada se repetem a cada volta à tela. */
(function () {
  'use strict';

  var doc = document;
  var raiz = doc.documentElement;
  var PREVIEW = raiz.hasAttribute('data-preview');
  var reduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
  var temIO = 'IntersectionObserver' in window;
  var semMovimento = function () { return reduzido.matches || !temIO; };
  var naoFaz = function () {};

  /* 1. Cabeçalho: ganha fundo depois da rolagem (sentinela, sem listener de scroll) e troca de tom
        quando uma caixa navy passa pela linha do meio dele (faixa de 1 px no IntersectionObserver) */
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

    var escuras = [].slice.call(doc.querySelectorAll('[data-escuro]'));
    var observador = null;
    var monta = function () {
      if (observador) observador.disconnect();
      var meio = Math.round(topo.offsetHeight / 2);
      var abaixo = Math.max(0, window.innerHeight - meio - 1);
      var sob = [];
      observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (e) {
          var i = sob.indexOf(e.target);
          if (e.isIntersecting && i < 0) sob.push(e.target);
          if (!e.isIntersecting && i >= 0) sob.splice(i, 1);
        });
        topo.setAttribute('data-tom', sob.length ? 'escuro' : 'claro');
      }, { rootMargin: '-' + meio + 'px 0px -' + abaixo + 'px 0px' });
      escuras.forEach(function (s) { observador.observe(s); });
    };
    monta();
    var altura = window.innerHeight;
    var espera = 0;
    window.addEventListener('resize', function () {
      clearTimeout(espera);
      espera = setTimeout(function () {
        if (window.innerHeight === altura) return;
        altura = window.innerHeight;
        monta();
      }, 150);
    });
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

  /* 3. Efeitos que se repetem: cada bloco volta ao estado inicial quando sai inteiro da tela e toca de novo quando
        volta, rolando para baixo ou para cima. O que já está na tela no carregamento não é escondido; sem JS ou com
        movimento reduzido tudo fica no estado final. */
  var PASSOS_DO_OBSERVADOR = [];
  for (var passo = 0; passo <= 20; passo++) PASSOS_DO_OBSERVADOR.push(passo / 20);
  var repete = function (el, op) {
    if (!el || semMovimento()) return;
    var estado = 'final';
    var timer = 0;
    var arma = function () { clearTimeout(timer); estado = 'armado'; op.arma(el); };
    var solta = function () { clearTimeout(timer); estado = 'final'; op.conclui(el); };
    var toca = function () {
      estado = 'tocando';
      op.toca(el);
      timer = setTimeout(function () { if (estado === 'tocando') solta(); }, op.duracao);
    };
    // blocos mais altos que a tela começam com uma fração menor visível. A altura vem do retângulo, que também existe
    // em SVG (offsetHeight não existe em SVG). Peças grandes cortadas pela caixa, como as marcas-d'água, nunca ficam
    // inteiras na tela: tocam também quando a parte visível ocupa metade da altura da tela.
    var limiar = function () { return Math.max(0.05, Math.min(op.limiar, 0.6 * window.innerHeight / Math.max(1, el.getBoundingClientRect().height))); };
    new IntersectionObserver(function (entradas) {
      var e = entradas[entradas.length - 1];
      if (reduzido.matches) { if (estado !== 'final') solta(); return; }
      if (!e.isIntersecting) { if (estado !== 'armado') arma(); return; }
      if (estado === 'armado' && (e.intersectionRatio >= limiar() || e.intersectionRect.height >= 0.5 * window.innerHeight)) toca();
    }, { threshold: PASSOS_DO_OBSERVADOR }).observe(el);
  };
  // o par de classes mais comum: "armada" (estado inicial) e a classe que roda a animação
  var porClasses = function (armada, ativa) {
    return {
      arma: function (el) { el.classList.remove(ativa); el.classList.add(armada); },
      toca: function (el) { el.classList.remove(armada); el.classList.add(ativa); },
      conclui: function (el) { el.classList.remove(armada); el.classList.remove(ativa); }
    };
  };
  var com = function (base, extra) { for (var k in extra) base[k] = extra[k]; return base; };

  /* 3a. Constelação do hero: a entrada é só CSS; o JS liga o ciclo da indicação (.em-ciclo) quando o
         hero está na tela e a entrada terminou (depois da intro, se houver). Com a aba oculta tudo para onde está
         (.pausada); quando o hero sai inteiro da tela, entrada e ciclo voltam ao início e tocam de novo na volta, a partir
         do "Você". Sem JS ou com movimento reduzido fica a composição estática do CSS. */
  (function constelacao() {
    var camada = doc.querySelector('[data-constelacao]');
    if (!camada || semMovimento()) return;
    var ENTRADA = 1900; // ms: símbolo, formandos, trajeto e etiqueta "Você" já entraram
    var espera = 0;
    var naTela = false;
    var comecou = false;
    var introAtiva = function () { return raiz.classList.contains('intro-ativa'); };
    var liga = function () {
      clearTimeout(espera);
      camada.classList.remove('em-ciclo');
      if (introAtiva()) return; // a intro cobre o hero; o observador abaixo chama de novo quando ela sai
      espera = setTimeout(function () { camada.classList.add('em-ciclo'); }, ENTRADA);
    };
    var desliga = function () { clearTimeout(espera); camada.classList.remove('em-ciclo'); };
    var pausa = function () { camada.classList.toggle('pausada', doc.hidden); };
    pausa();
    doc.addEventListener('visibilitychange', pausa);
    // primeira vez na tela com a entrada do CSS tocando (o hero visível na carga não é armado)
    new IntersectionObserver(function (entradas) {
      naTela = entradas[0].isIntersecting;
      if (naTela && !comecou) { comecou = true; if (!camada.classList.contains('armada')) liga(); }
    }).observe(camada);
    if (introAtiva() && 'MutationObserver' in window) {
      var fimDaIntro = new MutationObserver(function () {
        if (introAtiva()) return;
        fimDaIntro.disconnect();
        if (naTela && !camada.classList.contains('armada')) liga();
      });
      fimDaIntro.observe(raiz, { attributes: true, attributeFilter: ['class'] });
    }
    repete(camada, {
      limiar: 0.3, duracao: 2600,
      arma: function (el) { desliga(); el.classList.add('armada'); },
      toca: function (el) { el.classList.remove('armada'); comecou = true; liga(); },
      conclui: function (el) { el.classList.remove('armada'); }
    });
  })();

  /* 3b. Trilha 5 → 10 → 20 (momento principal) e passos da indicação, no estilo da ForDoctor Indica */
  repete(doc.querySelector('[data-trilha]'), com(porClasses('armada', 'desenhando'), { limiar: 0.35, duracao: 1500 }));
  repete(doc.querySelector('[data-passos]'), com(porClasses('armada', 'desenhando'), { limiar: 0.35, duracao: 2500 }));

  /* 3c. Traços desenhados: marcas-d'água do símbolo, órbita da foto, ícones da oferta e da contabilidade */
  [].forEach.call(doc.querySelectorAll('[data-desenha]'), function (el) {
    repete(el, com(porClasses('armada', 'desenhando'), { limiar: 0.2, duracao: 2900 }));
  });

  /* 3d. Foto de "O que é a Liga": o círculo abre a partir do centro quando a foto já carregou; o selo estoura depois */
  (function fotoDaLiga() {
    var figura = doc.querySelector('[data-foto-liga]');
    var img = figura && figura.querySelector('img');
    if (!img || semMovimento()) return;
    var quer = false;
    var abre = function () {
      if (!quer) return;
      figura.classList.remove('armada');
      figura.classList.add('revelada');
    };
    repete(figura, {
      limiar: 0.3, duracao: 1400,
      arma: function () { quer = false; figura.classList.remove('revelada'); figura.classList.add('armada'); },
      toca: function () {
        quer = true;
        if (img.complete && img.naturalWidth) abre();
        else img.addEventListener('load', abre, { once: true });
      },
      conclui: function () { quer = false; figura.classList.remove('armada', 'revelada'); }
    });
    img.addEventListener('error', function () { quer = false; figura.classList.remove('armada', 'revelada'); }, { once: true });
    // com o recorte fechado o navegador não dispara o lazy-load sozinho: pedimos a imagem quando a seção se aproxima
    var perto = new IntersectionObserver(function (entradas) {
      if (!entradas[0].isIntersecting) return;
      perto.disconnect();
      if (img.loading === 'lazy' && !img.currentSrc) img.loading = 'eager';
    }, { rootMargin: '0px 0px 900px 0px' });
    perto.observe(figura);
  })();

  /* 3e. Títulos H2 linha a linha (Siteflux): cada linha sobe de dentro da própria máscara, 90 ms entre linhas.
         O texto inteiro fica num trecho só para leitores de tela; as linhas visuais ficam ocultas para eles. */
  (function titulosPorLinha() {
    var titulos = [].slice.call(doc.querySelectorAll('[data-revela]'));
    if (!titulos.length || semMovimento()) return;
    var esc = function (s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
    var itens = titulos.map(function (el) {
      // divide só em espaços comuns: o espaço inseguível mantém palavras juntas, como no título final
      return { el: el, texto: el.textContent.replace(/[ \t\r\n]+/g, ' ').trim(), grupos: [] };
    });
    // em três passos para o navegador calcular o layout uma vez só: escreve as palavras, lê as posições, escreve as linhas
    var divide = function () {
      itens.forEach(function (it) {
        it.el.innerHTML = '<span class="so-leitor">' + esc(it.texto) + '</span><span class="titulo-linhas" aria-hidden="true">' +
          it.texto.split(' ').map(function (p) { return '<span data-p>' + esc(p) + '</span>'; }).join(' ') + '</span>';
      });
      itens.forEach(function (it) {
        var linhas = [];
        var topoAtual = null;
        [].forEach.call(it.el.querySelectorAll('[data-p]'), function (s) {
          var t = s.offsetTop;
          if (topoAtual === null || Math.abs(t - topoAtual) > 3) { linhas.push([]); topoAtual = t; }
          linhas[linhas.length - 1].push(s.textContent);
        });
        it.grupos = linhas;
      });
      itens.forEach(function (it) {
        it.el.querySelector('.titulo-linhas').innerHTML = it.grupos.map(function (l, i) {
          return '<span class="linha-mascara"><span class="linha-conteudo" style="--i:' + Math.min(i, 10) + '">' + esc(l.join(' ')) + '</span></span>';
        }).join(' ');
      });
    };
    var comeca = function () {
      requestAnimationFrame(function () {
        divide();
        itens.forEach(function (it) { repete(it.el, com(porClasses('revela-armado', 'revela-ativo'), { limiar: 0.6, duracao: 1900 })); });
      });
    };
    // a quebra de linha muda com a largura: refaz as linhas (as classes de estado continuam no título)
    var largura = window.innerWidth;
    var espera = 0;
    window.addEventListener('resize', function () {
      clearTimeout(espera);
      espera = setTimeout(function () {
        if (window.innerWidth === largura) return;
        largura = window.innerWidth;
        requestAnimationFrame(divide);
      }, 200);
    });
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(comeca, comeca); else comeca();
  })();

  /* 4. Parallax dos anéis: a camada azul de "O que a Liga oferece?" e a clara das recompensas andam juntas,
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

  /* 5. Formulário: UTM, máscara do WhatsApp, validação em português e estados de envio */
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

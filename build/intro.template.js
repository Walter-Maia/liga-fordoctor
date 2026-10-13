/* Liga ForDoctor: intro "a turma se liga". Gerado por build/gera-intro.mjs a partir deste molde;
   o path do símbolo vem de src/originais/logo_fordoctor.svg (vetor oficial, sem redesenho).
   Infraestrutura da skill efeito-de-intro: decisão no <head>, cobertura CSS com failsafe, dois rAF antes de tocar,
   fim natural + duas travas, pular por Esc/Tab/rolagem/roda/toque/clique/aba oculta, uma vez por sessão.
   Roteiro de tempos: comentário "Intro" em src/assets/liga.css. */
(function () {
  'use strict';
  var raiz = document.documentElement;
  if (!raiz.classList.contains('intro-ativa')) return;

  var DURACAO = 3100;     // fim da coreografia (ms); igual ao --rise-start do CSS
  var SAIDA = 520;        // dissolução
  var SIMBOLO = '__SIMBOLO__';
  var LOGO = 'assets/img/logo-fordoctor-claro.svg';
  var CENTRO = [46.68, 46.57]; // centro do símbolo no viewBox do logo (341,01 × 93,48)

  var overlay = null, feito = false, timers = [];

  function libera() {
    raiz.classList.remove('intro-ativa', 'intro-saindo');
    raiz.style.removeProperty('--rise-start');
  }
  function limpa() {
    timers.forEach(clearTimeout);
    document.removeEventListener('keydown', aoTeclar, true);
    document.removeEventListener('visibilitychange', aoOcultar);
    document.removeEventListener('wheel', aoGesto, true);
    document.removeEventListener('touchstart', aoGesto, true);
    document.removeEventListener('pointerdown', aoGesto, true);
    window.removeEventListener('scroll', aoGesto);
  }
  function termina(natural) {
    if (feito) return;
    feito = true;
    limpa();
    try { sessionStorage.setItem('liga-intro', '1'); } catch (e) { /* storage bloqueado */ }
    if (natural) { raiz.classList.add('intro-saindo'); raiz.classList.remove('intro-ativa'); } else libera();
    if (document.activeElement && overlay && overlay.contains(document.activeElement)) document.activeElement.blur();
    if (!overlay) return;
    overlay.classList.add('li-saindo'); // continua capturando cliques até sair do DOM
    setTimeout(function () { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }, natural ? SAIDA + 40 : 320);
    if (natural) setTimeout(libera, SAIDA + 1000);
  }
  var ROLAGEM = { ' ': 1, PageDown: 1, PageUp: 1, ArrowDown: 1, ArrowUp: 1, End: 1, Home: 1 };
  function aoTeclar(e) {
    if (ROLAGEM[e.key]) { e.preventDefault(); termina(false); }
    else if (e.key === 'Escape' || e.key === 'Tab' || e.key === 'Enter') termina(false);
  }
  function aoOcultar() { if (document.hidden) termina(false); }
  function aoGesto(e) {
    if (e.type === 'pointerdown' && e.pointerType === 'touch') return;
    if (e.cancelable && (e.type === 'wheel' || e.type === 'touchstart')) e.preventDefault();
    termina(false);
  }

  function palco() {
    var f = function (n) { return n.toFixed(2); };
    var ponto = function (r, graus) {
      var a = graus * Math.PI / 180;
      return [CENTRO[0] + r * Math.cos(a), CENTRO[1] + r * Math.sin(a)];
    };
    // dez anéis concêntricos a partir do símbolo; os de fora mais suaves
    var aneis = '';
    for (var i = 0; i < 10; i++) {
      aneis += '<circle class="li-anel" style="--i:' + i + ';--o:' + (0.52 - i * 0.04).toFixed(2) + '" r="' + (56 + 20 * i) + '"/>';
    }
    // seis colegas (pontos) sobre os anéis, ligados ao símbolo por curvas que giram no mesmo sentido
    var COLEGAS = [[96, 200], [136, 248], [116, 296], [156, 332], [96, 28], [136, 146]];
    var curvas = '', pontos = '';
    COLEGAS.forEach(function (c, i) {
      var p = ponto(c[0], c[1]), q = ponto((c[0] + 50) / 2, c[1] + 22), fim = ponto(50, c[1] + 32);
      curvas += '<path class="li-con" style="--i:' + i + '" pathLength="1" d="M' + f(p[0]) + ' ' + f(p[1]) + 'Q' + f(q[0]) + ' ' + f(q[1]) + ' ' + f(fim[0]) + ' ' + f(fim[1]) + '"/>';
      pontos += '<circle class="li-no" style="--i:' + i + '" cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="2.6"/>';
    });
    // anéis numa camada fixa no centro da tela: começam em volta do símbolo e, quando a câmera desliza, emolduram o logo inteiro
    return '<svg class="li-campo" viewBox="-250 -250 500 500" aria-hidden="true" focusable="false"><g class="li-aneis">' + aneis + '</g></svg>' +
      '<div class="li-palco">' +
      '<div class="li-cam">' +
        '<svg class="li-svg" viewBox="0 0 341.01 93.48" aria-hidden="true" focusable="false">' +
          curvas + pontos +
          '<path class="li-preenche" d="' + SIMBOLO + '"/>' +
          '<path class="li-contorno" pathLength="1" d="' + SIMBOLO + '"/>' +
        '</svg>' +
        '<img class="li-logo" src="' + LOGO + '" alt="" width="341" height="93" decoding="async">' +
      '</div>' +
      '<p class="li-legenda"><span class="li-filete"></span><span class="li-nome">Liga ForDoctor</span></p>' +
    '</div>';
  }

  try {
    if (performance.now() > 3000 || window.pageYOffset > 4) throw new Error('chegou tarde');
    overlay = document.createElement('div');
    overlay.className = 'li-intro';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = palco();
    document.body.appendChild(overlay);

    document.addEventListener('keydown', aoTeclar, true);
    document.addEventListener('visibilitychange', aoOcultar);
    document.addEventListener('wheel', aoGesto, { capture: true, passive: false });
    document.addEventListener('touchstart', aoGesto, { capture: true, passive: false });
    document.addEventListener('pointerdown', aoGesto, true);
    window.addEventListener('scroll', aoGesto, { passive: true });

    var toca = function () {
      if (feito || overlay.classList.contains('li-tocando')) return;
      overlay.classList.add('li-tocando');
      // o cabeçalho entra quando a dissolução começa, contando do relógio real da página
      raiz.style.setProperty('--rise-start', ((performance.now() + DURACAO) / 1000).toFixed(2) + 's');
      timers.push(setTimeout(function () { termina(true); }, DURACAO));
    };
    requestAnimationFrame(function () { requestAnimationFrame(toca); });
    timers.push(setTimeout(toca, 250));                                                        // aba sem rAF
    timers.push(setTimeout(function () { if (!overlay.classList.contains('li-tocando')) termina(false); }, 1500));
    timers.push(setTimeout(function () { termina(false); }, DURACAO + 2000));
  } catch (erro) {
    termina(false);
  }
})();

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
  var SIMBOLO = 'm92.66,23.55c-.65.76-1.37,1.47-2.06,2.16l-.47.46c-3.35,3.35-6.7,6.7-10.06,10.05l-1.65,1.65c-.88.87-1.93.9-2.75.11-.4-.38-.61-.83-.61-1.32,0-.36.11-.91.66-1.46,3.24-3.24,6.48-6.48,9.72-9.72.34-.33.68-.67,1.01-1.01.86-.87,1.74-1.76,2.66-2.61-2.1-2.1-4.19-4.2-6.29-6.31l-3.78-3.8c-1.91-1.91-3.86-3.86-5.96-5.95-.5-.49-1.03-1.01-1.67-1.62-2.15,2.13-4.35,4.32-6.15,6.13l-3.96,3.94c-2.8,2.8-5.6,5.6-8.4,8.39-.45.45-.97.68-1.5.68-.85,0-1.56-.6-1.84-1.57-.1-.34-.19-.68-.29-1.01l-.02-.08c-.49-1.73-1-3.53-1.88-5.09-2.3-4.09-5.59-7.04-9.78-8.76-2.49-1.03-5.1-1.55-7.76-1.55-7.68,0-14.51,4.33-17.84,11.29-3.47,7.27-2.68,14.34,2.33,21.01,2.39,3.18,5.64,5.44,9.66,6.69,1.98.62,4.22.91,7.04.91.45,0,.93,0,1.45-.02l4.99-.14c2.12-.06,4.21-.12,6.3-.17l3.69-.1c3.56-.1,7.19-.21,10.77-.28l1.09-.02c1.03-.03,2.1-.05,3.16-.05,1.17,0,2.19.03,3.13.09,5.37.37,10.17,2.52,14.26,6.39,3.59,3.4,5.93,7.52,6.93,12.25,2.46,11.52-4.05,23.24-15.14,27.25-2.66.96-5.42,1.45-8.2,1.45-7.63,0-14.62-3.62-19.17-9.94-1.45-2.01-2.57-4.22-3.32-6.57-4.54,4.57-9.5,9.57-15.55,15.64-.37.37-.78.75-1.32,1.23-.78.68-1.45.98-2.16.98s-1.38-.31-2.12-.98c-.87-.8-1.7-1.63-2.5-2.44-.25-.26-.51-.52-.77-.78l-4.68-4.68c-2.51-2.5-5.09-5.09-7.64-7.62-.55-.55-1.14-1.1-1.71-1.62-.4-.37-.77-.71-1.14-1.06-.27-.26-.48-.55-.66-.79-.92-1.26-.95-2.34-.09-3.59.44-.63.96-1.18,1.41-1.63,3.57-3.53,7.14-7.05,10.71-10.58l3.3-3.26c.09-.1.17-.18.26-.26.82-.73,1.95-.71,2.68.04.78.8.76,1.88-.04,2.69-1.04,1.05-2.09,2.09-3.14,3.14l-3.62,3.62c-2.2,2.2-4.41,4.4-6.6,6.6-.46.46-.9.93-1.29,1.37l.34.34c3.1,3.12,6.31,6.36,9.49,9.51,1.4,1.39,2.84,2.79,4.23,4.14l.08.07c.95.93,1.9,1.85,2.85,2.78.22.22.41.45.59.67.02.01.03.03.04.04,1.64-1.6,3.38-3.29,5.11-5.02,3.71-3.69,7.46-7.45,11.09-11.09l2.24-2.23c.28-.29.82-.82,1.64-.82.18,0,.37.03.56.08,1.07.32,1.26,1.25,1.36,1.76v.05c1.2,5.73,4.22,10.18,8.98,13.22,5.56,3.56,11.47,4.24,17.32,2.01,7.76-2.96,12.2-8.64,13.19-16.86,1.06-8.81-4.59-17.7-13.15-20.69-2.25-.78-4.69-1.14-7.69-1.14-.35,0-.72,0-1.09.01-2.1.06-4.19.12-6.28.18l-7.4.18c-3.12.07-6.24.15-9.37.21-.93.02-1.87.05-2.79.08-1.53.05-3.11.11-4.68.11-.73,0-1.41-.02-2.07-.04-6.69-.24-12.4-3.01-16.97-8.24-2.74-3.13-4.53-6.8-5.34-10.9-1.88-9.57,2.4-19.44,10.65-24.55C23.66,1.19,30.62.36,37.6,2.76c7.11,2.45,11.96,7.25,14.44,14.29l.13.37c.06.14.11.29.16.44.95-.95,1.89-1.89,2.84-2.84l.34-.34c.64-.63,1.27-1.26,1.9-1.9l10.85-10.88c.32-.33.66-.64.89-.84,1.6-1.45,3.11-1.41,4.64.1,1.09,1.08,2.17,2.16,3.25,3.24l.21.21c1.18,1.18,2.39,2.39,3.6,3.58,1.77,1.76,3.55,3.51,5.33,5.26l.38.37c1.61,1.58,3.21,3.15,4.81,4.73.45.45.9.96,1.32,1.51.9,1.17.89,2.41-.03,3.49Z';
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

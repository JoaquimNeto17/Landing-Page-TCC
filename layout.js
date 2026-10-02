/* Seções de uma tela e navegação para o início da seção escolhida. */
(() => {
  'use strict';
  const sections = [...document.querySelectorAll('main > section')];
  const desktop = window.matchMedia('(min-width: 851px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let fitFrame = 0;
  function fitSections() {
    fitFrame = 0;
    sections.forEach(section => {
      const content = section.querySelector('.container');
      if (!content) return;
      const style = getComputedStyle(section);
      const viewport = parseFloat(style.minHeight) || window.innerHeight;
      const padding = (parseFloat(style.paddingTop) || 0) + (parseFloat(style.paddingBottom) || 0);
      const overflowing = desktop.matches && content.scrollHeight > viewport - padding + 2;
      section.classList.toggle('section-overflow', overflowing);
    });
  }
  const scheduleFit = () => {
    if (!fitFrame) fitFrame = requestAnimationFrame(fitSections);
  };
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(scheduleFit);
    sections.forEach(section => {
      const content = section.querySelector('.container');
      if (content) observer.observe(content);
    });
  }
  window.addEventListener('resize', scheduleFit, {passive: true});
  desktop.addEventListener('change', scheduleFit);
  document.addEventListener('toggle', scheduleFit, true);
  fitSections();

  let navigationVersion = 0;
  function moveTo(target, smooth) {
    if (target.tagName === 'DETAILS') target.open = true;
    const destination = target.closest('main > section') || target;
    fitSections();
    if (typeof window.ScrollTrigger !== 'undefined') window.ScrollTrigger.refresh();
    destination.scrollIntoView({block: 'start', inline: 'nearest', behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto'});
    // Mantém o foco fora do menu recolhido e na seção que será lida.
    if (!destination.hasAttribute('tabindex')) destination.setAttribute('tabindex', '-1');
    destination.focus({preventScroll: true});
  }
  function targetFor(hash) {
    try { return hash && document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch (_) { return null; }
  }
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', event => {
    if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = link.getAttribute('href');
    const target = targetFor(hash);
    if (!target) return;
    event.preventDefault();
    navigationVersion++;
    if (window.location.hash !== hash) history.pushState(null, '', hash);
    moveTo(target, true);
  }));
  const followHash = () => {
    const target = targetFor(window.location.hash);
    if (target) {navigationVersion++;moveTo(target, false);}
  };
  window.addEventListener('hashchange', followHash);
  window.addEventListener('popstate', () => {
    if (window.location.hash) followHash();
    else {navigationVersion++;window.scrollTo({top: 0, behavior: 'auto'});}
  });
  document.addEventListener('pointerdown', () => {navigationVersion++;}, {once: true});
  document.addEventListener('keydown', () => {navigationVersion++;}, {once: true});
  const readyVersion = navigationVersion;
  const alignInitialHash = () => {
    fitSections();
    if (navigationVersion === readyVersion) {
      const target = targetFor(window.location.hash);
      if (target) moveTo(target, false);
    }
  };
  window.addEventListener('load', alignInitialHash, {once: true});
  if (document.fonts) document.fonts.ready.then(alignInitialHash);
})();

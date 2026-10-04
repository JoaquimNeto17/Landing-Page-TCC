/* Movimento das seções e progresso discreto, com rolagem nativa livre. */
(() => {
  'use strict';
  const main = document.querySelector('main');
  if (!main) return;
  const gsap = window.gsap;
  const trigger = window.ScrollTrigger;
  const hasMotion = Boolean(gsap && trigger);
  const readingLine = document.querySelector('.reading-progress');
  let frame = 0;
  let refreshFrame = 0;
  let maximum = 1;
  const clamp = value => Math.max(0, Math.min(1, value));

  function measure() {
    maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }
  function update() {
    frame = 0;
    if (readingLine) {
      readingLine.hidden = window.scrollY < 80;
      readingLine.style.transform = `scaleX(${clamp(window.scrollY / maximum)})`;
    }
  }
  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }
  function refresh() {
    if (refreshFrame) return;
    refreshFrame = window.requestAnimationFrame(() => {
      refreshFrame = 0;
      measure();
      if (hasMotion) trigger.refresh();
      schedule();
    });
  }
  window.addEventListener('scroll', schedule, {passive: true});
  window.addEventListener('resize', refresh, {passive: true});
  window.addEventListener('load', refresh);
  document.querySelectorAll('img').forEach(image => {
    if (!image.complete) {
      image.addEventListener('load', refresh, {once: true});
      image.addEventListener('error', refresh, {once: true});
    }
  });
  if (document.fonts) document.fonts.ready.then(refresh);
  if (window.ResizeObserver) new ResizeObserver(refresh).observe(main);
  measure();
  update();
  // Duas camadas de aurora substituem os canvases; as demais seções ficam limpas.
  const ambientSections = Array.from(document.querySelectorAll('.hero, .project-section, .closing-section'));
  ambientSections.forEach(section => {
    section.classList.add('ambient-surface');
    for (let index = 0; index < 2; index++) {
      const layer = document.createElement('div');
      layer.className = 'ambient-aurora';
      layer.setAttribute('aria-hidden', 'true');
      section.prepend(layer);
    }
  });
  if (!hasMotion) return; // Sem GSAP, nenhum conteúdo fica oculto.

  gsap.registerPlugin(trigger);
  trigger.addEventListener('refresh', () => { measure(); schedule(); });
  const media = gsap.matchMedia();
  const revealed = new WeakSet();
  let heroShown = false;
  const blocksSelector = '.section-heading, .intro-grid > div, .resource-row, .platform-gallery, .game-card, .mascot-intro, .steps > li, .project-heading, .project-copy, .pricing-calculator, .faq-layout > div:first-child, .faq-list > details, .closing-inner';
  media.add({
    desktop: '(min-width: 851px)',
    mobile: '(max-width: 850px)',
    reduce: '(prefers-reduced-motion: reduce)'
  }, context => {
    const {desktop, reduce} = context.conditions;
    const blocks = Array.from(document.querySelectorAll(blocksSelector));
    const scene = document.querySelector('.earth-scene');
    const hero = document.querySelector('.hero');
    const layers = Array.from(document.querySelectorAll('.ambient-aurora'));
    if (reduce) {
      gsap.set([...blocks, ...layers, ...(scene ? [scene] : [])], {clearProps: 'opacity,transform'});
      return;
    }
    const cleanup = [];
    const distance = desktop ? 24 : 16;
    const entry = {opacity: 1, y: 0, duration: .7, ease: 'power3.out', clearProps: 'opacity,transform'};

    // Spans somente nos nós de texto: preserva a quebra de linha e o destaque dourado.
    const title = document.getElementById('hero-title');
    if (title && hero && !heroShown && window.scrollY < hero.getBoundingClientRect().height) {
      heroShown = true;
      const originalHTML = title.innerHTML;
      const originalLabel = title.getAttribute('aria-label');
      const accessibleTitle = Array.from(title.childNodes).map(node => node.nodeName === 'BR' ? ' ' : node.textContent).join('').replace(/\s+/g, ' ').trim();
      const words = [];
      function splitText(parent) {
        Array.from(parent.childNodes).forEach(node => {
          if (node.nodeType === 3) {
            const fragment = document.createDocumentFragment();
            node.textContent.split(/(\s+)/).forEach(part => {
              if (!part || /^\s+$/.test(part)) {fragment.append(document.createTextNode(part));return;}
              const word = document.createElement('span');
              word.className = 'hero-word'; word.textContent = part;
              word.setAttribute('aria-hidden', 'true');
              words.push(word); fragment.append(word);
            });
            node.replaceWith(fragment);
          } else if (node.nodeType === 1 && node.nodeName !== 'BR') splitText(node);
        });
      }
      splitText(title);
      title.setAttribute('aria-label', accessibleTitle);
      const intro = gsap.timeline({defaults: entry});
      intro.fromTo(words, {opacity: 0, y: distance}, {...entry, stagger: .035});
      const description = hero.querySelector('.hero-description');
      const actions = hero.querySelector('.hero-actions');
      if (description) intro.fromTo(description, {opacity: 0, y: distance}, entry, '-=.12');
      if (actions) intro.fromTo(actions, {opacity: 0, y: distance}, entry, '-=.12');
      cleanup.push(() => {
        title.innerHTML = originalHTML;
        if (originalLabel === null) title.removeAttribute('aria-label');
        else title.setAttribute('aria-label', originalLabel);
      });
    }

    // Não esconde blocos já percorridos ou visíveis ao restaurar scroll/redimensionar.
    const pending = blocks.filter(block => !revealed.has(block) && block.getBoundingClientRect().top >= window.innerHeight * .9);
    blocks.filter(block => !pending.includes(block)).forEach(block => revealed.add(block));
    gsap.set(pending, {opacity: 0});
    context.add('revealBatch', targets => {
      const fresh = targets.filter(target => !revealed.has(target));
      fresh.forEach(target => revealed.add(target));
      if (fresh.length) gsap.fromTo(fresh, {opacity: 0, y: distance}, {...entry, stagger: desktop ? .06 : .035, overwrite: 'auto'});
    });
    if (pending.length) trigger.batch(pending, {start: 'top 90%', once: true, interval: .08, batchMax: desktop ? 4 : 2, onEnter: context.revealBatch, onEnterBack: context.revealBatch});
    context.add('revealFocus', event => {
      const block = event.target.closest(blocksSelector);
      if (!block) return;
      revealed.add(block);
      gsap.killTweensOf(block);
      gsap.set(block, {clearProps: 'opacity,transform'});
    });
    main.addEventListener('focusin', context.revealFocus);
    cleanup.push(() => main.removeEventListener('focusin', context.revealFocus));

    const limitedDevice = (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || navigator.connection?.saveData;
    // No celular ou em aparelhos modestos, aurora e Terra permanecem estáticas.
    if (desktop && !limitedDevice) {
      function watchVisibility(section, tweens) {
        const bounds = section.getBoundingClientRect();
        let inView = bounds.bottom > 0 && bounds.top < window.innerHeight;
        let suspended = false;
        const sync = () => tweens.forEach(tween => inView && !document.hidden && !suspended ? tween.resume() : tween.pause());
        const observer = window.IntersectionObserver ? new IntersectionObserver(entries => {inView = entries[0].isIntersecting;sync();}) : null;
        if (!observer) return; // Sem observação, não inicia ciclos permanentes.
        observer.observe(section);
        const hide = () => {suspended = true;sync();};
        const show = () => {suspended = false;sync();};
        document.addEventListener('visibilitychange', sync);
        window.addEventListener('pagehide', hide);
        window.addEventListener('pageshow', show);
        sync();
        cleanup.push(() => {observer.disconnect();document.removeEventListener('visibilitychange', sync);window.removeEventListener('pagehide', hide);window.removeEventListener('pageshow', show);});
      }
      ambientSections.forEach(section => {
        const curtains = section.querySelectorAll('.ambient-aurora');
        const drift = gsap.to(curtains, {xPercent: index => index ? -2 : 2, yPercent: index => index ? 1 : -1, duration: 30, repeat: -1, yoyo: true, ease: 'sine.inOut', paused: true});
        watchVisibility(section, [drift]);
      });
      if (scene && hero) {
        // O giro da esfera pertence a script.js; parallax atua apenas neste contêiner.
        gsap.to(scene, {yPercent: -1.2, ease: 'none', scrollTrigger: {trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.2, pin: false}});
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
          const xTo = gsap.quickTo(scene, 'x', {duration: .8, ease: 'power3.out'});
          const yTo = gsap.quickTo(scene, 'y', {duration: .8, ease: 'power3.out'});
          const move = event => {
            const rect = hero.getBoundingClientRect();
            xTo(gsap.utils.clamp(-4, 4, (event.clientX - rect.left - rect.width / 2) / Math.max(1, rect.width) * 8));
            yTo(gsap.utils.clamp(-3, 3, (event.clientY - rect.top - rect.height / 2) / Math.max(1, rect.height) * 6));
          };
          const leave = () => {xTo(0);yTo(0);};
          hero.addEventListener('pointermove', move, {passive: true});
          hero.addEventListener('pointerleave', leave);
          cleanup.push(() => {hero.removeEventListener('pointermove', move);hero.removeEventListener('pointerleave', leave);});
        }
      }
    }
    return () => cleanup.forEach(remove => remove());
  });
  refresh();
})();

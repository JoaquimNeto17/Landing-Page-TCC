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
      readingLine.style.width = `${clamp(window.scrollY / maximum) * 100}%`;
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
  if (document.fonts) document.fonts.ready.then(refresh);
  if (window.ResizeObserver) new ResizeObserver(refresh).observe(main);
  measure();
  update();
  if (!hasMotion) return;

  gsap.registerPlugin(trigger);
  trigger.addEventListener('refresh', () => { measure(); schedule(); });
  const media = gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)', () => {
    function reveal(selector, options = {}) {
      const elements = Array.from(document.querySelectorAll(selector));
      if (!elements.length) return;
      const {group = false, ...motion} = options;
      const settings = {opacity: 0, y: 14, duration: .55, ease: 'power2.out', clearProps: 'opacity,transform', ...motion};
      if (group) {
        gsap.from(elements, {...settings, stagger: .07, scrollTrigger: {trigger: elements[0].parentElement, start: 'top 86%', once: true}});
      } else {
        elements.forEach(element => gsap.from(element, {...settings, scrollTrigger: {trigger: element, start: 'top 88%', once: true}}));
      }
    }
    document.querySelectorAll('.section-heading').forEach(heading => {
      const children = heading.querySelectorAll('.eyebrow, h2, :scope > p');
      gsap.from(children, {opacity: 0, y: 16, duration: .6, stagger: .08, ease: 'power2.out', clearProps: 'opacity,transform', scrollTrigger: {trigger: heading, start: 'top 86%', once: true}});
    });
    reveal('.intro-grid > div', {group: true});
    reveal('.resource-row', {group: true});
    reveal('.platform-gallery', {y: 14});
    reveal('.game-card', {group: true});
    reveal('.mascot-intro', {y: 18});
    reveal('.steps > li', {group: true});
    reveal('.project-heading > .eyebrow, .project-heading > h2');
    reveal('.project-copy > *', {group: true});
    reveal('.calculator-controls, .calculator-result', {y: 18});
    reveal('.faq-layout > div:first-child');
    reveal('.faq-list > details', {group: true, y: 16});
    reveal('.closing-inner > *', {group: true});

  });
})();

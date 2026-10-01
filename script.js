/* GEOEDUCA landing page — configuração de integração */
const GEOEDUCA_CONFIG = Object.freeze({
  // A pasta landing fica dentro de frontend; o login existente continua em frontend/index.html.
  platformUrl: '../index.html'
});

(() => {
  'use strict';
  document.querySelectorAll('[data-platform-link]').forEach(link => {
    link.href = GEOEDUCA_CONFIG.platformUrl;
  });
  document.getElementById('year').textContent = new Date().getFullYear();
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.getElementById('navigation');
  const closeMenu = () => {
    nav.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
  });
  window.matchMedia('(min-width: 851px)').addEventListener('change', closeMenu);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gsapAvailable = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (gsapAvailable) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('.reading-progress', { width: '100%', ease: 'none', scrollTrigger: {trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: true} });
    const motions = gsap.matchMedia();
    motions.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-copy > *', {opacity: 0, y: 22, duration: .8, stagger: .09, ease: 'power2.out', clearProps: 'all'});
      document.querySelectorAll('.reveal').forEach(element => {
        gsap.from(element, {y: 24, opacity: 0, duration: .7, ease: 'power2.out', clearProps: 'all', scrollTrigger: {trigger: element, start: 'top 92%', once: true}});
      });
    });
  }

  // Valores aprovados. A alternância é informativa e não processa pagamentos.
  const planValues = {professor: {monthly: 29.90, annual: 299}, escola: {monthly: 149.90, annual: 1499}};
  const formatPrice = value => value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
  document.querySelectorAll('input[name="billing-period"]').forEach(input => {
    input.addEventListener('change', () => {
      if (!input.checked) return;
      const annual = input.value === 'annual';
      document.querySelectorAll('[data-plan]').forEach(card => {
        const values = planValues[card.dataset.plan];
        card.querySelector('[data-price-amount]').textContent = formatPrice(annual ? values.annual : values.monthly);
        card.querySelector('[data-price-period]').textContent = annual ? '/ano' : '/mês';
        card.querySelector('[data-price-caption]').textContent = annual
          ? `Pago antecipadamente. Equivale a R$ ${formatPrice(values.annual / 12)} por mês.`
          : `Ou R$ ${formatPrice(values.annual)} por ano, pago antecipadamente.`;
        if (gsapAvailable && !reducedMotion.matches) {
          gsap.fromTo(card.querySelector('.plan-price'), {opacity: .5, y: 6}, {opacity: 1, y: 0, duration: .3, overwrite: true, clearProps: 'transform,opacity'});
        }
      });
    });
  });
  document.querySelectorAll('a[href="#contratacao"]').forEach(link => link.addEventListener('click', () => {
    document.getElementById('contratacao').open = true;
  }));

  // Fundo abstrato de linhas e pontos: anima somente as seções visíveis.
  (() => {
    const layers = [];
    let frameHandle = 0;
    let lastFrame = 0;
    let elapsed = 0;
    const darkSections = new Set(['hero', 'project-section', 'closing-section']);
    function paint(layer, time) {
      const {ctx, width: w, height: h, dark, points} = layer;
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = .75;
      const lineColor = dark ? 'rgba(204,164,59,0.20)' : 'rgba(11,10,50,0.055)';
      const pointColor = dark ? 'rgba(204,164,59,0.60)' : 'rgba(35,59,11,0.18)';
      // Traços contínuos sugerem uma malha cartográfica em movimento.
      ctx.strokeStyle = lineColor;
      for (let line = 0; line < 11; line++) {
        ctx.beginPath();
        for (let x = -40; x <= w + 40; x += 20) {
          const wave = Math.sin(x / Math.max(w, 1) * Math.PI * 2 + time * .12 + line * .38);
          const y = h * (line + .3) / 10 + wave * Math.min(42, h * .05) + Math.cos(time * .16 + line) * 12;
          if (x === -40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      const positions = points.map(point => ({x: (point.x + Math.sin(time * .13 + point.phase) * .035) * w, y: (point.y + Math.cos(time * .11 + point.phase) * .035) * h}));
      ctx.strokeStyle = dark ? 'rgba(204,164,59,0.12)' : 'rgba(11,10,50,0.045)';
      for (let i = 0; i < positions.length; i++) {
        const a = positions[i];
        for (let j = i + 1; j < positions.length; j++) {
          const b = positions[j];
          if (Math.hypot(a.x - b.x, a.y - b.y) < 145) {
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        ctx.beginPath(); ctx.arc(a.x, a.y, dark ? 1.7 : 1.3, 0, Math.PI * 2); ctx.fillStyle = pointColor; ctx.fill();
      }
    }
    function frame(timestamp) {
      frameHandle = 0;
      if (reducedMotion.matches || document.hidden || !layers.some(layer => layer.visible)) {lastFrame = 0; return;}
      if (!lastFrame || timestamp - lastFrame >= 33) {
        elapsed += lastFrame ? Math.min((timestamp - lastFrame) / 1000, .06) : 0;
        lastFrame = timestamp;
        layers.filter(layer => layer.visible).forEach(layer => paint(layer, elapsed));
      }
      frameHandle = requestAnimationFrame(frame);
    }
    function start() {
      if (!frameHandle && !reducedMotion.matches && !document.hidden && layers.some(layer => layer.visible)) frameHandle = requestAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const layer = layers.find(item => item.section === entry.target);
        if (layer) layer.visible = entry.isIntersecting;
      });
      start();
    }, {rootMargin: '60px'});
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const layer = layers.find(item => item.section === entry.target);
        if (!layer) return;
        layer.width = Math.ceil(entry.contentRect.width);
        // contentRect exclui padding: o canvas precisa cobrir toda a seção.
        layer.height = Math.ceil(layer.section.getBoundingClientRect().height);
        layer.canvas.width = layer.width;
        layer.canvas.height = layer.height;
        paint(layer, elapsed);
      });
      start();
    });
    document.querySelectorAll('main > section').forEach((section, index) => {
      const background = document.createElement('canvas');
      background.className = 'ambient-canvas'; background.setAttribute('aria-hidden', 'true');
      const ctx = background.getContext('2d');
      if (!ctx) return;
      section.classList.add('ambient-surface');
      section.prepend(background);
      const points = Array.from({length: window.innerWidth < 601 ? 10 : 24}, (_, i) => ({x: ((i * .618033 + index * .11) % 1), y: ((i * .414213 + .15) % 1), phase: i * 1.8 + index}));
      layers.push({section, canvas: background, ctx, points, width: 0, height: 0, visible: false, dark: [...darkSections].some(name => section.classList.contains(name))});
      observer.observe(section); resizeObserver.observe(section);
    });
    const updateMotion = () => {
      if (frameHandle) cancelAnimationFrame(frameHandle);
      frameHandle = 0; lastFrame = 0;
      layers.forEach(layer => paint(layer, elapsed));
      start();
    };
    reducedMotion.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateMotion);
    window.addEventListener('pagehide', () => {if (frameHandle) cancelAnimationFrame(frameHandle); frameHandle = 0;});
    window.addEventListener('pageshow', start);
  })();

  // Interações de mouse complementam o conteúdo; não substituem o teclado.
  if (gsapAvailable) {
    const interactionMedia = gsap.matchMedia();
    interactionMedia.add('(min-width: 851px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const magnetListeners = [];
      document.querySelectorAll('.button').forEach(button => {
        const xTo = gsap.quickTo(button, 'x', {duration: .3, ease: 'power3.out'});
        const yTo = gsap.quickTo(button, 'y', {duration: .3, ease: 'power3.out'});
        const onMove = event => {
          const bounds = button.getBoundingClientRect();
          xTo(gsap.utils.clamp(-5, 5, (event.clientX - bounds.left - bounds.width / 2) * .07));
          yTo(gsap.utils.clamp(-4, 4, (event.clientY - bounds.top - bounds.height / 2) * .1));
        };
        const onLeave = () => {xTo(0); yTo(0);};
        button.addEventListener('pointermove', onMove, {passive: true});
        button.addEventListener('pointerleave', onLeave);
        magnetListeners.push(() => {button.removeEventListener('pointermove', onMove); button.removeEventListener('pointerleave', onLeave);});
      });
      return () => magnetListeners.forEach(remove => remove());
    });
    interactionMedia.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.steps .step-number', {scale: .78, duration: .65, stagger: .1, ease: 'back.out(1.3)', scrollTrigger: {trigger: '.steps', start: 'top 85%', once: true}});
      document.querySelectorAll('.game-word').forEach(word => {
        gsap.fromTo(word, {y: 10}, {y: -10, ease: 'none', scrollTrigger: {trigger: word.closest('.game-card'), start: 'top bottom', end: 'bottom top', scrub: 1}});
      });
      gsap.from('.preview-options > div', {x: 18, duration: .65, stagger: .1, ease: 'power2.out', clearProps: 'x', scrollTrigger: {trigger: '.preview-options', start: 'top 88%', once: true}});
    });
  }

  const canvas = document.getElementById('earth-canvas');
  const sceneElement = document.querySelector('.earth-scene');
  if (typeof window.THREE === 'undefined') return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true, powerPreference: 'low-power'});
  } catch (_) {
    canvas.hidden = true;
    sceneElement.setAttribute('aria-label', 'Representação da superfície terrestre');
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, .1, 30);
  camera.position.set(0, 0, 4.35);
  const world = new THREE.Group();
  world.rotation.z = .13;
  scene.add(world);
  const geometry = new THREE.SphereGeometry(1, 64, 40);
  const material = new THREE.MeshPhongMaterial({color: 0xffffff, shininess: 8, specular: 0x263845});
  const earth = new THREE.Mesh(geometry, material);
  earth.rotation.y = -0.70;
  world.add(earth);
  scene.add(new THREE.AmbientLight(0x9aaed0, 1.6));
  const sunlight = new THREE.DirectionalLight(0xfff3de, 2.6);
  sunlight.position.set(-3, 2, 4);
  scene.add(sunlight);
  const rimLight = new THREE.DirectionalLight(0x6286ac, .55);
  rimLight.position.set(3, 0, -3);
  scene.add(rimLight);
  const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(1.04, 48, 32), new THREE.ShaderMaterial({
    uniforms: {glowColor: {value: new THREE.Color(0x6d9dc5)}},
    vertexShader: 'varying vec3 vNormal; varying vec3 vPosition; void main(){ vNormal=normalize(normalMatrix*normal); vec4 pos=modelViewMatrix*vec4(position,1.0); vPosition=pos.xyz; gl_Position=projectionMatrix*pos; }',
    fragmentShader: 'uniform vec3 glowColor; varying vec3 vNormal; varying vec3 vPosition; void main(){ float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(-vPosition))),4.0); gl_FragColor=vec4(glowColor,rim*0.32); }',
    transparent: true, side: THREE.BackSide, depthWrite: false, blending: THREE.AdditiveBlending
  }));
  world.add(atmosphere);
  function render() { renderer.render(scene, camera); }
  function resize() {
    const {width, height} = sceneElement.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    render();
  }
  new ResizeObserver(resize).observe(sceneElement);
  resize();
  const loader = new THREE.TextureLoader();
  loader.load(window.GEOEDUCA_EARTH_TEXTURE || 'assets/earth.jpg', texture => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    material.map = texture;
    material.needsUpdate = true;
    sceneElement.classList.add('is-ready');
    canvas.dataset.ready = 'true';
    render();
  }, undefined, () => {
    canvas.hidden = true;
    sceneElement.setAttribute('aria-label', 'Representação da superfície terrestre');
  });
  if (gsapAvailable) {
    const motions = gsap.matchMedia();
    motions.add({desktop: '(min-width: 851px)', mobile: '(max-width: 850px)', motion: '(prefers-reduced-motion: no-preference)'}, context => {
      const {desktop, motion} = context.conditions;
      if (!motion) return;
      gsap.to(earth.rotation, {y: -0.70 + Math.PI * 2.5, ease: 'none', onUpdate: () => {
        canvas.dataset.rotation = earth.rotation.y.toFixed(3);
        render();
      }, scrollTrigger: {
        trigger: '.hero', start: desktop ? 'top top' : 'top top',
        end: desktop ? '+=700' : 'bottom top',
        pin: desktop, pinSpacing: true, scrub: 1.15, anticipatePin: 1,
        invalidateOnRefresh: true
      }});
      return () => {earth.rotation.y = -0.70; render();};
    });
  } else if (!reducedMotion.matches) {
    // Fallback sem GSAP: o globo continua acompanhando o scroll.
    let scheduled = false;
    window.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        earth.rotation.y = -0.70 + window.scrollY * .007;
        render(); scheduled = false;
      });
    }, {passive: true});
  }
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    sceneElement.classList.remove('is-ready');
    canvas.hidden = true;
  });
  document.fonts.ready.then(() => {resize(); if (gsapAvailable) ScrollTrigger.refresh();});
  window.addEventListener('load', () => {if (gsapAvailable) ScrollTrigger.refresh();});
})();

/* GEOEDUCA landing page — interações e animações. */
(() => {
  'use strict';
  document.documentElement.classList.add('js-enabled');
  // Os links de acesso usam diretamente o href do HTML, sem reescrita por JavaScript.
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
  const compactMenu = window.matchMedia('(max-width: 1100px)');
  compactMenu.addEventListener('change', () => {
    const focusWasInNav = nav.contains(document.activeElement);
    const focusWasOnButton = document.activeElement === menuButton;
    closeMenu();
    if (compactMenu.matches && focusWasInNav) menuButton.focus();
    else if (!compactMenu.matches && focusWasOnButton) nav.querySelector('a').focus();
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gsapAvailable = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  if (gsapAvailable) {
    gsap.registerPlugin(ScrollTrigger);
    if (document.fonts) document.fonts.ready.then(() => ScrollTrigger.refresh());
    window.addEventListener('load', () => ScrollTrigger.refresh());
    const motions = gsap.matchMedia();
    motions.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.hero-copy > *', {opacity: 0, y: 22, duration: .8, stagger: .09, ease: 'power2.out', clearProps: 'all'});

    });
  }

  // Simulador informativo: a contratação não é processada nesta página.
  (() => {
    const calculator = document.querySelector('.pricing-calculator');
    if (!calculator || typeof GEOEDUCA_PRICING === 'undefined') return;
    const countInput = document.getElementById('student-count');
    countInput.readOnly = false;
    const promotion = document.getElementById('launch-promotion');
    const error = document.getElementById('student-error');
    const billingInputs = document.querySelectorAll('input[name="billing-period"]');
    const presets = document.querySelectorAll('[data-student-preset]');
    const currency = calculator.querySelector('[data-price-currency]');
    const amount = calculator.querySelector('[data-price-amount]');
    const period = calculator.querySelector('[data-price-period]');
    const caption = calculator.querySelector('[data-price-caption]');
    const perStudent = calculator.querySelector('[data-price-per-student]');
    const saving = calculator.querySelector('[data-price-saving]');
    const breakdown = calculator.querySelector('[data-price-breakdown]');
    const quoteDetails = calculator.querySelector('.quote-details');
    const money = cents => (cents / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
    function update(animate = false) {
      const annual = [...billingInputs].some(input => input.checked && input.value === 'annual');
      if (annual) promotion.checked = false;
      const quantity = Number(countInput.value);
      const quote = GEOEDUCA_PRICING.quote(quantity, {annual,launch: promotion.checked});
      const priced = quote.kind === 'priced';
      const invalid = quote.kind === 'invalid';
      promotion.disabled = annual || !priced;
      error.hidden = !invalid;
      countInput.setAttribute('aria-invalid', String(invalid));
      countInput.setCustomValidity(invalid ? 'Informe uma quantidade inteira de alunos, maior que zero.' : '');
      presets.forEach(button => button.setAttribute('aria-pressed', String(!invalid && Number(button.dataset.studentPreset) === quantity)));
      calculator.querySelector('[data-quote-title]').textContent = invalid ? 'SUA ESTIMATIVA' : `SUA ESTIMATIVA / ${quantity.toLocaleString('pt-BR')} ${quantity === 1 ? 'ALUNO' : 'ALUNOS'}`;
      currency.hidden = !priced;
      period.textContent = priced ? annual ? '/ano' : '/mês' : '';
      amount.classList.toggle('is-custom', !priced);
      breakdown.hidden = !priced;
      quoteDetails.hidden = !priced;
      saving.hidden = !priced;
      perStudent.hidden = !priced;
      if (!priced) {
        amount.textContent = invalid ? '—' : 'Personalizado';
        caption.textContent = invalid ? 'Informe uma quantidade inteira válida para calcular.' : 'Acima de 1.000 alunos, o valor será definido em uma proposta personalizada após a avaliação do uso.';
      } else {
        amount.textContent = money(quote.priceCents);
        perStudent.textContent = `Equivale a R$ ${money(quote.perStudentMonthlyCents)} por aluno/mês${annual ? ", para comparação" : quote.launchApplied ? " nas três primeiras mensalidades" : ""}.`;
        if (annual) {
          caption.textContent = `Pago antecipadamente. Equivale a R$ ${money(quote.annualEquivalentCents)} por mês, para comparação.`;
          saving.textContent = `Economia de R$ ${money(quote.annualSavingsCents)} em relação a 12 mensalidades regulares.`;
        } else if (quote.launchApplied) {
          caption.textContent = `Valor nas três primeiras mensalidades. Depois, R$ ${money(quote.regularMonthlyCents)}/mês. Mínimo mensal de R$ 29,90 respeitado.`;
          saving.textContent = `Economia de R$ ${money(quote.launchSavingsCents)} nas três primeiras mensalidades. Promoção exclusiva do mensal.`;
          if (quote.launchSavingsCents === 0) {
            caption.textContent = 'A mensalidade mínima de R$ 29,90 já se aplica a esta quantidade. A promoção não reduz o valor abaixo desse mínimo.';
            saving.hidden = true;
          }
        } else {
          caption.textContent = `Ou R$ ${money(quote.annualCents)} por ano, pago antecipadamente.`;
          saving.textContent = `Economia de R$ ${money(quote.annualSavingsCents)} ao escolher o anual.`;
        }
        quote.parts.forEach((part,index) => {
          const row = calculator.querySelector(`[data-tier="${index}"]`);
          row.hidden = part.quantity === 0;
          row.querySelector('[data-tier-label]').textContent = `${part.quantity.toLocaleString('pt-BR')} ${part.quantity === 1 ? 'aluno' : 'alunos'} × R$ ${money(part.rateCents)}`;
          row.querySelector('[data-tier-total]').textContent = `R$ ${money(part.subtotalCents)}`;
        });
        calculator.querySelector('[data-minimum-adjustment]').hidden = quote.minimumAdjustmentCents === 0;
        calculator.querySelector('[data-minimum-total]').textContent = `R$ ${money(quote.minimumAdjustmentCents)}`;
        calculator.querySelector('[data-regular-total]').textContent = `R$ ${money(quote.regularMonthlyCents)}`;
      }
      if (animate && gsapAvailable && !reducedMotion.matches) gsap.fromTo(calculator.querySelector('.plan-price'), {opacity: .6,y: 5}, {opacity: 1,y: 0,duration: .25,overwrite: true,clearProps: 'transform,opacity'});
    }
    countInput.addEventListener('input', () => update());
    billingInputs.forEach(input => input.addEventListener('change', () => update(true)));
    promotion.addEventListener('change', () => update(true));
    presets.forEach(button => button.addEventListener('click', () => {
      countInput.value = button.dataset.studentPreset;
      update(true);
    }));
    update();
  })();
  // Fundo abstrato de linhas e pontos: anima somente as seções visíveis.
  (() => {
    const layers = [];
    let frameHandle = 0;
    let lastFrame = 0;
    let elapsed = 0;
    const darkSections = new Set(['hero', 'project-section', 'closing-section']);
    const lightEffects = window.matchMedia('(max-width: 850px), (pointer: coarse)');
    const pointCount = () => lightEffects.matches ? 10 : 24;
    function paint(layer, time) {
      const {ctx, width: w, height: h, points} = layer;
      const dark = layer.dark || document.documentElement.dataset.theme === 'dark';
      if (!w || !h) return;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = .75;
      const lineColor = dark ? 'rgba(204,164,59,0.20)' : 'rgba(11,10,50,0.055)';
      const pointColor = dark ? 'rgba(204,164,59,0.60)' : 'rgba(35,59,11,0.18)';
      // Traços contínuos sugerem uma malha cartográfica em movimento.
      ctx.strokeStyle = lineColor;
      for (let line = 0; line < (lightEffects.matches ? 8 : 11); line++) {
        ctx.beginPath();
        for (let x = -40; x <= w + 40; x += 20) {
          const wave = Math.sin(x / Math.max(w, 1) * Math.PI * 2 + time * .12 + line * .38);
          const y = h * (line + .3) / (lightEffects.matches ? 7 : 10) + wave * Math.min(42, h * .05) + Math.cos(time * .16 + line) * 12;
          if (x === -40) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      const positions = points.slice(0, pointCount()).map(point => ({x: (point.x + Math.sin(time * .13 + point.phase) * .035) * w, y: (point.y + Math.cos(time * .11 + point.phase) * .035) * h}));
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
      if (!lastFrame || timestamp - lastFrame >= (lightEffects.matches ? 50 : 33)) {
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
        const bounds = layer.section.getBoundingClientRect();
        layer.width = Math.ceil(bounds.width);
        layer.height = Math.ceil(bounds.height);
        if (!layer.width || !layer.height) return;
        // Limita a memória do fundo, mesmo em seções longas no celular.
        const scale = Math.min(1, 1600 / layer.height, Math.sqrt(1000000 / (layer.width * layer.height)));
        layer.canvas.width = Math.max(1, Math.round(layer.width * scale));
        layer.canvas.height = Math.max(1, Math.round(layer.height * scale));
        layer.ctx.setTransform(layer.canvas.width / layer.width, 0, 0, layer.canvas.height / layer.height, 0, 0);
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
      const points = Array.from({length: 24}, (_, i) => ({x: ((i * .618033 + index * .11) % 1), y: ((i * .414213 + .15) % 1), phase: i * 1.8 + index}));
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
    lightEffects.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateMotion);
    window.addEventListener('pagehide', () => {if (frameHandle) cancelAnimationFrame(frameHandle); frameHandle = 0;});
    window.addEventListener('pageshow', start);
    window.addEventListener('geoeduca:themechange', updateMotion);
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
  }

  const canvas = document.getElementById('earth-canvas');
  const sceneElement = document.querySelector('.earth-scene');
  if (typeof window.THREE === 'undefined') {
    canvas.hidden = true;
    sceneElement.setAttribute('aria-label', 'Representação da superfície terrestre');
    return;
  }
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true, powerPreference: 'low-power'});
  } catch (_) {
    canvas.hidden = true;
    sceneElement.setAttribute('aria-label', 'Representação da superfície terrestre');
    return;
  }
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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.matchMedia('(max-width: 850px), (pointer: coarse)').matches ? 1.25 : 1.5));
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
    motions.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(earth.rotation, {y: -0.70 + Math.PI * 2.5, ease: 'none', onUpdate: () => {
        canvas.dataset.rotation = earth.rotation.y.toFixed(3);
        render();
      }, scrollTrigger: {
        trigger: '.hero', start: 'top top',
        end: 'bottom top',
        pin: false, scrub: 1.15,
        invalidateOnRefresh: true
      }});
      return () => {earth.rotation.y = -0.70; render();};
    });
  } else {
    // Fallback sem GSAP: o globo continua acompanhando o scroll.
    let scheduled = false;
    window.addEventListener('scroll', () => {
      if (scheduled || reducedMotion.matches) return;
      scheduled = true;
      requestAnimationFrame(() => {
        earth.rotation.y = -0.70 + window.scrollY * .007;
        render(); scheduled = false;
      });
    }, {passive: true});
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) {earth.rotation.y = -0.70; render();}
    });
  }
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    sceneElement.classList.remove('is-ready');
    canvas.hidden = true;
  });
  if (document.fonts) document.fonts.ready.then(resize);
})();

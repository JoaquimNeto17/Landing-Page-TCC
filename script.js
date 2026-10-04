/* GEOEDUCA landing page — interações e animações. */
(() => {
  'use strict';
  document.documentElement.classList.add('js-enabled');
  // Galeria de capturas reais: seleção manual, teclado e movimento reduzido.
  (() => {
    document.querySelectorAll('.platform-gallery').forEach(gallery => {
    const tabList = gallery.querySelector('[data-gallery-tabs]');
    if (!tabList) return;
    const tabs = [...tabList.querySelectorAll('button')];
    const panels = [...gallery.querySelectorAll('[data-gallery-panel]')];
    if (!tabs.length || tabs.length !== panels.length || tabs.some((tab, index) => tab.getAttribute('aria-controls') !== panels[index].id)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let selected = 0;
    function clearMotion() {
      if (window.gsap) window.gsap.killTweensOf(panels);
      panels.forEach(panel => {
        panel.style.opacity = '';
        panel.style.transform = '';
      });
    }
    function select(index, focus = false, animate = true) {
      const changed = index !== selected;
      clearMotion();
      selected = index;
      tabs.forEach((tab, current) => {
        tab.setAttribute('aria-selected', String(current === index));
        tab.tabIndex = current === index ? 0 : -1;
        panels[current].hidden = current !== index;
      });
      if (focus) tabs[index].focus({preventScroll: true});
      if (changed && animate && !reduced.matches && window.gsap) {
        window.gsap.fromTo(panels[index], {opacity: 0, y: 6}, {opacity: 1, y: 0, duration: .22, ease: 'power2.out', overwrite: true, clearProps: 'opacity,transform'});
      }
    }
    tabList.setAttribute('role', 'tablist');
    tabList.setAttribute('aria-label', gallery.getAttribute('data-gallery-label') || 'Telas da área do aluno');
    tabs.forEach((tab, index) => {
      tab.setAttribute('role', 'tab');
      panels[index].setAttribute('role', 'tabpanel');
      panels[index].setAttribute('aria-labelledby', tab.id);
      panels[index].tabIndex = 0;
      tab.addEventListener('click', () => select(index));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        select(next, true);
      });
    });
    reduced.addEventListener('change', () => {if (reduced.matches) clearMotion();});
    select(0, false, false);
    tabList.hidden = false;
    });
  })();
  // O aviso de espera é temporário: acompanha somente o endereço hospedado no Render.
  document.querySelectorAll('[data-platform-link][aria-describedby]').forEach(link => {
    const note = document.getElementById(link.getAttribute('aria-describedby'));
    if (!note) return;
    try { note.hidden = !new URL(link.href, window.location.href).hostname.endsWith('.onrender.com'); }
    catch (_) { note.hidden = true; }
    if (note.hidden) link.removeAttribute('aria-describedby');
  });
  // Solicitações assistidas: prepara a mensagem; o visitante conclui o envio no aplicativo.
  (() => {
    const dialog = document.getElementById('request-dialog');
    const form = document.getElementById('request-form');
    if (!dialog || !form || typeof dialog.showModal !== 'function') return;
    const name = document.getElementById('request-name');
    const email = document.getElementById('request-email');
    const profile = document.getElementById('request-profile');
    const students = document.getElementById('request-students');
    const summary = document.getElementById('request-quote');
    const status = document.getElementById('request-status');
    const title = document.getElementById('request-title');
    const studentLabel = document.getElementById('request-students-label');
    const money = cents => `R$ ${(cents / 100).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    let kind = 'access', annual = false, launch = false, opener = null;
    let previousOverflow = '';
    function quotation() {
      if (students.value === '' && kind === 'demo' && !students.validity.badInput) return null;
      const count = Number(students.value);
      if (students.validity.badInput || !Number.isSafeInteger(count) || count < 1) return {kind: 'invalid'};
      if (typeof GEOEDUCA_PRICING === 'undefined') return {kind: 'custom', studentCount: count};
      return GEOEDUCA_PRICING.quote(count, {annual, launch});
    }
    function priceLines(quote) {
      if (!quote) return ['Quantidade de alunos e plano a combinar.'];
      if (quote.kind === 'custom') return [`Período solicitado: ${annual ? 'anual' : 'mensal'}.`, 'Proposta personalizada: valor a combinar.'];
      if (quote.kind !== 'priced') return [];
      const lines = [`Período: ${annual ? 'anual' : 'mensal'}.`, `Mensalidade regular: ${money(quote.regularMonthlyCents)}.`];
      if (annual) {
        lines.push(`Estimativa anual: ${money(quote.annualCents)}, pagamento antecipado; 12 meses pelo valor de 10 mensalidades.`);
      } else if (quote.launchApplied) {
        lines.push(`Promoção de lançamento: ${money(quote.priceCents)}/mês nas três primeiras mensalidades; depois ${money(quote.regularMonthlyCents)}/mês. Mínimo mensal de R$ 29,90 respeitado.`);
      } else {
        lines.push(`Estimativa: ${money(quote.priceCents)}/mês, sem promoção selecionada.`);
      }
      return lines;
    }
    function updateSummary() {
      const quote = quotation();
      students.setCustomValidity(quote?.kind === 'invalid' ? 'Informe uma quantidade inteira de alunos, maior que zero.' : '');
      students.setAttribute('aria-invalid', String(quote?.kind === 'invalid'));
      summary.textContent = quote?.kind === 'invalid' ? 'Informe uma quantidade inteira de alunos, maior que zero.' : priceLines(quote).join(' ');
      status.textContent = '';
      return quote;
    }
    document.querySelectorAll('[data-request-kind]').forEach(link => {
      link.addEventListener('click', event => {
        if (event.defaultPrevented || event.button > 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        kind = link.dataset.requestKind === 'demo' ? 'demo' : 'access';
        title.textContent = kind === 'demo' ? 'Solicitar uma demonstração' : 'Solicitar acesso';
        annual = Boolean(document.querySelector('input[name="billing-period"][value="annual"]:checked'));
        launch = !annual && Boolean(document.getElementById('launch-promotion')?.checked);
        students.required = kind === 'access';
        studentLabel.textContent = kind === 'demo' ? 'Quantidade de alunos (opcional)' : 'Quantidade de alunos';
        students.value = kind === 'demo' ? '' : document.getElementById('student-count')?.value || '';
        updateSummary();
        // Se o navegador não conseguir abrir o formulário, o href continua levando ao contato.
        try { dialog.showModal(); } catch (_) { return; }
        event.preventDefault();
        opener = link;
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        name.focus({preventScroll: true});
      });
    });
    dialog.querySelector('.request-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => {
      document.body.style.overflow = previousOverflow;
      opener?.focus({preventScroll: true});
    });
    // Fecha somente quando o clique começa e termina fora do conteúdo.
    let backdropPressed = false;
    const outside = event => {
      const bounds = dialog.getBoundingClientRect();
      return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    };
    dialog.addEventListener('pointerdown', event => {backdropPressed = event.target === dialog && outside(event);});
    dialog.addEventListener('click', event => {
      if (backdropPressed && event.target === dialog && outside(event)) dialog.close();
      backdropPressed = false;
    });
    students.addEventListener('input', updateSummary);
    name.addEventListener('input', () => name.setCustomValidity(''));
    form.addEventListener('submit', event => {
      event.preventDefault();
      const quote = updateSummary();
      name.setCustomValidity(name.value.trim().length < 2 ? 'Informe seu nome com pelo menos dois caracteres.' : '');
      if (!form.reportValidity()) return;
      const lines = [
        kind === 'demo' ? 'Olá, gostaria de solicitar uma demonstração do GEOEDUCA.' : 'Olá, gostaria de solicitar acesso ao GEOEDUCA.',
        '', `Nome: ${name.value.trim()}`, `E-mail: ${email.value.trim()}`,
        `Perfil: ${profile.value === 'school' ? 'Escola' : 'Professor'}`,
        ...(quote ? [`Quantidade de alunos: ${quote.studentCount}`] : []),
        ...priceLines(quote), '',
        'Simulação informativa. Gostaria de combinar as condições de contratação e liberação do acesso.'
      ];
      const message = lines.join('\n');
      const useEmail = event.submitter?.value === 'email';
      const subject = kind === 'demo' ? 'Demonstração do GEOEDUCA' : 'Solicitação de acesso ao GEOEDUCA';
      const url = useEmail
        ? `mailto:joaquim.neto.senai@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
        : `https://wa.me/5515996817066?text=${encodeURIComponent(message)}`;
      status.textContent = `A mensagem está pronta. Revise e conclua o envio ${useEmail ? 'no seu aplicativo de e-mail' : 'no WhatsApp'}.`;
      try { window.location.assign(url); }
      catch (_) { status.textContent = 'Não foi possível abrir o aplicativo. Entre em contato pelo WhatsApp (15) 99681-7066 ou pelo e-mail joaquim.neto.senai@gmail.com.'; }
    });
    form.hidden = false;
  })();
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
  // Hero e entradas de seção compartilham a base de motion.js.

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
  // Fundo abstrato substituído pela aurora de motion.js, sem desenho por frame.

  // Interações de mouse complementam o conteúdo; não substituem o teclado.
  if (gsapAvailable) {
    const interactionMedia = gsap.matchMedia();
    interactionMedia.add('(min-width: 851px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
      const magnetListeners = [];
      document.querySelectorAll('.button').forEach(button => {
        if (button.closest('.request-dialog')) return;
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
  // Recuperado do backup: a textura gira na esfera 3D, não no canvas inteiro.
  // O backup tinha giro pelo scroll (2,5π, scrub 1,15), sem loop automático.
  const rotationState = {idle: 0, scroll: 0};
  const heroElement = sceneElement.closest('.hero');
  const initialBounds = heroElement.getBoundingClientRect();
  let earthInView = initialBounds.bottom > 0 && initialBounds.top < window.innerHeight;
  let earthSuspended = false;
  let earthContextLost = false;
  let rotationFrame = 0;
  let idleTween = null;
  let scrollTween = null;
  let fallbackFrame = 0;
  let lastRotationTime = 0;
  const mayRotate = () => !reducedMotion.matches && !document.hidden && !earthSuspended && !earthContextLost && earthInView;
  function updateEarthRotation() {
    if (!mayRotate()) return;
    earth.rotation.y = -.70 + rotationState.idle + rotationState.scroll;
    canvas.dataset.rotation = earth.rotation.y.toFixed(3);
    // Scroll e loop compartilham um único render por frame.
    if (!rotationFrame) rotationFrame = requestAnimationFrame(() => {
      rotationFrame = 0;
      if (mayRotate()) render();
    });
  }
  function fallbackRotation(timestamp) {
    fallbackFrame = 0;
    if (!mayRotate()) {lastRotationTime = 0;return;}
    if (lastRotationTime) rotationState.idle += Math.min((timestamp - lastRotationTime) / 1000, .1) * Math.PI * 2 / 75;
    lastRotationTime = timestamp;
    rotationState.scroll = window.scrollY * .007; // Coeficiente do fallback original.
    updateEarthRotation();
    fallbackFrame = requestAnimationFrame(fallbackRotation);
  }
  function syncEarthRotation() {
    if (idleTween) {
      if (mayRotate()) idleTween.resume(); else idleTween.pause();
      if (reducedMotion.matches || earthContextLost) scrollTween.scrollTrigger.disable(false);
      else scrollTween.scrollTrigger.enable(false);
    } else if (mayRotate() && !fallbackFrame) fallbackFrame = requestAnimationFrame(fallbackRotation);
    if (!mayRotate()) {
      if (rotationFrame) cancelAnimationFrame(rotationFrame);
      if (fallbackFrame) cancelAnimationFrame(fallbackFrame);
      rotationFrame = fallbackFrame = lastRotationTime = 0;
    } else updateEarthRotation();
  }
  if (gsapAvailable) {
    gsap.registerPlugin(ScrollTrigger);
    // Loop independente, acrescentado para o giro contínuo solicitado.
    idleTween = gsap.to(rotationState, {idle: Math.PI * 2, duration: 75, repeat: -1, ease: 'none', paused: true, onUpdate: updateEarthRotation});
    scrollTween = gsap.to(rotationState, {scroll: Math.PI * 2.5, ease: 'none', onUpdate: updateEarthRotation, scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top',
      pin: false, scrub: 1.15, invalidateOnRefresh: true
    }});
  }
  if (window.IntersectionObserver) {
    new IntersectionObserver(entries => {
      earthInView = entries[0].isIntersecting;
      syncEarthRotation();
    }).observe(heroElement);
  }
  reducedMotion.addEventListener('change', syncEarthRotation);
  document.addEventListener('visibilitychange', syncEarthRotation);
  window.addEventListener('pagehide', () => {earthSuspended = true;syncEarthRotation();});
  window.addEventListener('pageshow', () => {earthSuspended = false;syncEarthRotation();});
  syncEarthRotation();
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault();
    earthContextLost = true;
    syncEarthRotation();
    sceneElement.classList.remove('is-ready');
    canvas.hidden = true;
  });
  if (document.fonts) document.fonts.ready.then(resize);
})();

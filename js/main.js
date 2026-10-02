(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const main = document.querySelector('main');
  const footer = document.querySelector('.site-footer');
  const mobileNav = document.querySelector('#mobile-nav');
  const menuSummary = mobileNav?.querySelector('summary');
  const mobileMenu = mobileNav?.querySelector('.mobile-menu');
  const cursor = document.querySelector('.cursor');
  const cursorLabel = cursor?.querySelector('span');
  const cursorIcon = cursor?.querySelector('svg');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const cinematicViewport = window.matchMedia('(min-width: 901px)');
  const workSequence = document.querySelector('[data-work-sequence]');
  const workScenes = [...document.querySelectorAll('[data-work-scene]')];
  const workProgress = workSequence?.querySelector('.work-sequence__progress');
  const workProgressFill = workProgress?.querySelector('span');
  const workCurrent = workSequence?.querySelector('[data-work-current]');
  const statement = document.querySelector('#statement');
  const wordSequence = statement?.querySelector('[data-word-sequence]');
  const words = [...(wordSequence?.querySelectorAll('[data-word]') || [])];
  const hero = document.querySelector('.hero');
  const buildStory = document.querySelector('[data-build-story]');
  const buildSteps = [...(buildStory?.querySelectorAll('[data-build-step]') || [])];
  const buildCurrent = buildStory?.querySelector('[data-build-current]');
  const buildLine = buildStory?.querySelector('.build-story__line-progress');
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  root.classList.add('js-ready');

  function updateHeader() {
    header?.classList.toggle('is-scrolled', window.scrollY > 32);
  }

  let menuScrollY = 0;
  let focusAfterClose = null;
  function syncMenu() {
    if (!mobileNav || !menuSummary) return;
    const isOpen = mobileNav.open;
    const wasLocked = body.classList.contains('menu-open');
    menuSummary.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    menuSummary.setAttribute('aria-expanded', String(isOpen));
    body.classList.toggle('menu-open', isOpen);
    if (main) main.inert = isOpen;
    if (footer) footer.inert = isOpen;

    if (isOpen && !wasLocked) {
      menuScrollY = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${menuScrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      requestAnimationFrame(() => mobileMenu?.querySelector('a')?.focus({ preventScroll: true }));
    } else if (!isOpen && wasLocked) {
      body.style.removeProperty('position');
      body.style.removeProperty('top');
      body.style.removeProperty('left');
      body.style.removeProperty('right');
      body.style.removeProperty('width');
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(0, menuScrollY);
      requestAnimationFrame(() => {
        if (previousScrollBehavior) root.style.scrollBehavior = previousScrollBehavior;
        else root.style.removeProperty('scroll-behavior');
      });
      const target = focusAfterClose;
      focusAfterClose = null;
      if (target) requestAnimationFrame(() => target.focus({ preventScroll: true }));
      else requestAnimationFrame(() => menuSummary.focus({ preventScroll: true }));
    }
  }

  mobileNav?.addEventListener('toggle', syncMenu);
  mobileNav?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const hash = link.getAttribute('href')?.slice(1);
      const target = hash ? document.getElementById(decodeURIComponent(hash)) : null;
      if (target && !target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      focusAfterClose = target;
      mobileNav.open = false;
      syncMenu();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (!mobileNav?.open) return;
    if (event.key === 'Escape') {
      mobileNav.open = false;
      syncMenu();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [menuSummary, ...((mobileMenu && [...mobileMenu.querySelectorAll('a[href]')]) || [])]
      .filter((element) => element && !element.hasAttribute('inert'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });

  const services = [...document.querySelectorAll('[data-service]')];
  services.forEach((service, index) => {
    const button = service.querySelector('.service__trigger');
    const detail = service.querySelector('.service__detail');
    if (!button || !detail) return;
    if (index > 0) service.classList.remove('is-open');
    const isOpen = service.classList.contains('is-open');
    button.setAttribute('aria-expanded', String(isOpen));
    detail.setAttribute('aria-hidden', String(!isOpen));
    detail.toggleAttribute('inert', !isOpen);

    button.addEventListener('click', () => {
      const nextOpen = !service.classList.contains('is-open');
      services.forEach((other) => {
        const otherButton = other.querySelector('.service__trigger');
        const otherDetail = other.querySelector('.service__detail');
        const shouldOpen = other === service && nextOpen;
        other.classList.toggle('is-open', shouldOpen);
        otherButton?.setAttribute('aria-expanded', String(shouldOpen));
        otherDetail?.setAttribute('aria-hidden', String(!shouldOpen));
        otherDetail?.toggleAttribute('inert', !shouldOpen);
      });
    });
  });

  let currentWorkIndex = -1;
  let currentBuildIndex = -1;
  let buildPathLength = 1;
  try {
    buildPathLength = buildLine?.getTotalLength() || 1;
    if (buildLine) {
      buildLine.style.strokeDasharray = `${buildPathLength}`;
      buildLine.style.strokeDashoffset = `${buildPathLength}`;
    }
  } catch { /* Keep the static list if SVG path measurement is unavailable. */ }

  function setWorkActive(index) {
    if (index === currentWorkIndex) return;
    currentWorkIndex = index;
    workScenes.forEach((scene, sceneIndex) => {
      const active = sceneIndex === index;
      scene.classList.toggle('is-active', active);
      scene.inert = !active;
      scene.setAttribute('aria-hidden', String(!active));
    });
    const scene = workScenes[index];
    const name = scene?.dataset.projectName || 'Selected project';
    if (workCurrent) workCurrent.textContent = `${String(index + 1).padStart(2, '0')} / ${String(workScenes.length).padStart(2, '0')}`;
    if (workProgress) {
      workProgress.setAttribute('aria-valuenow', String(index + 1));
      workProgress.setAttribute('aria-valuetext', `${name}, ${index + 1} of ${workScenes.length} projects`);
    }
  }

  let cinematicEnabled = false;
  function syncCinematicMode() {
    const shouldEnable = cinematicViewport.matches && !reduceMotion.matches && workScenes.length > 0;
    if (shouldEnable === cinematicEnabled) return;
    cinematicEnabled = shouldEnable;
    workSequence?.classList.toggle('is-cinematic', shouldEnable);
    buildStory?.classList.toggle('is-cinematic', shouldEnable);
    if (shouldEnable) {
      currentWorkIndex = -1;
      currentBuildIndex = -1;
      setWorkActive(0);
    } else {
      workScenes.forEach((scene) => {
        scene.inert = false;
        scene.removeAttribute('aria-hidden');
        scene.classList.remove('is-active');
        scene.style.removeProperty('z-index');
        ['--scene-opacity', '--scene-present', '--scene-x', '--scene-scale', '--scene-clip', '--scene-image-scale'].forEach((property) => scene.style.removeProperty(property));
      });
      workScenes[0]?.classList.add('is-active');
      currentWorkIndex = -1;
      buildSteps.forEach((step, index) => {
        step.classList.toggle('is-active', index === 0);
        step.classList.remove('is-past');
        step.removeAttribute('aria-current');
      });
      currentBuildIndex = -1;
    }
    updateScrollExperiences();
  }

  function updateScrollExperiences() {
    updateHeader();
    if (reduceMotion.matches) {
      hero?.style.removeProperty('--hero-opacity');
      hero?.style.removeProperty('--hero-y');
      hero?.style.removeProperty('--hero-scale');
      return;
    }

    if (hero) {
      const progress = clamp(-hero.getBoundingClientRect().top / Math.max(hero.offsetHeight * .72, 1));
      hero.style.setProperty('--hero-opacity', `${1 - progress * .26}`);
      hero.style.setProperty('--hero-y', `${-progress * 24}px`);
      hero.style.setProperty('--hero-scale', `${1 - progress * .025}`);
    }

    if (words.length && statement) {
      const rect = statement.getBoundingClientRect();
      const progress = clamp((window.innerHeight * .82 - rect.top) / (rect.height + window.innerHeight * .52));
      const activeIndex = Math.min(words.length - 1, Math.floor(progress * words.length));
      words.forEach((word, index) => {
        word.classList.toggle('is-active', index === activeIndex);
        word.classList.toggle('is-past', index < activeIndex);
      });
    }

    if (cinematicEnabled && workSequence && workScenes.length) {
      const travel = Math.max(workSequence.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-workSequence.getBoundingClientRect().top / travel);
      const position = progress * (workScenes.length - 1);
      const baseIndex = Math.min(workScenes.length - 1, Math.floor(position));
      const transition = baseIndex === workScenes.length - 1 ? 0 : position - baseIndex;
      const activeIndex = Math.min(workScenes.length - 1, Math.max(0, Math.round(position)));
      workScenes.forEach((scene, index) => {
        const isBase = index === baseIndex;
        const isIncoming = index === baseIndex + 1 && transition > .001;
        const visible = isBase || isIncoming;
        const reveal = isIncoming ? transition : 1;
        scene.style.zIndex = isIncoming ? '4' : isBase ? '3' : '2';
        scene.style.setProperty('--scene-opacity', visible ? '1' : '0');
        scene.style.setProperty('--scene-present', visible ? '1' : '0');
        scene.style.setProperty('--scene-x', isIncoming ? `${((1 - transition) * 18).toFixed(1)}px` : isBase ? `${(-transition * 18).toFixed(1)}px` : '0px');
        scene.style.setProperty('--scene-scale', isIncoming ? `${(.994 + transition * .006).toFixed(3)}` : isBase ? `${(1 - transition * .006).toFixed(3)}` : '.994');
        scene.style.setProperty('--scene-clip', isIncoming ? `${((1 - reveal) * 100).toFixed(1)}%` : '0%');
        scene.style.setProperty('--scene-image-scale', isIncoming ? `${(1.055 - transition * .055).toFixed(3)}` : '1');
      });
      setWorkActive(activeIndex);
      if (workProgressFill) workProgressFill.style.transform = `scaleX(${(position + 1) / workScenes.length})`;
    }

    if (cinematicEnabled && buildStory && buildSteps.length) {
      const travel = Math.max(buildStory.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-buildStory.getBoundingClientRect().top / travel);
      const position = progress * (buildSteps.length - 1);
      const activeIndex = Math.min(buildSteps.length - 1, Math.max(0, Math.round(position)));
      buildSteps.forEach((step, index) => {
        step.classList.toggle('is-active', index === activeIndex);
        step.classList.toggle('is-past', index < activeIndex);
        if (index === activeIndex) step.setAttribute('aria-current', 'step');
        else step.removeAttribute('aria-current');
      });
      if (activeIndex !== currentBuildIndex && buildCurrent) {
        currentBuildIndex = activeIndex;
        buildCurrent.textContent = `${String(activeIndex + 1).padStart(2, '0')} / ${buildSteps[activeIndex].querySelector('h3')?.textContent || ''}`;
      }
      if (buildLine) buildLine.style.strokeDashoffset = `${buildPathLength * (1 - progress)}`;
    }
  }

  let scrollFrame = 0;
  function scheduleScrollUpdate() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updateScrollExperiences();
    });
  }
  window.addEventListener('scroll', scheduleScrollUpdate, { passive: true });
  window.addEventListener('resize', () => {
    if (mobileNav?.open && window.innerWidth > 900) {
      mobileNav.open = false;
      syncMenu();
    }
    syncCinematicMode();
    scheduleScrollUpdate();
  }, { passive: true });
  cinematicViewport.addEventListener?.('change', syncCinematicMode);
  reduceMotion.addEventListener?.('change', () => {
    syncCinematicMode();
    if (reduceMotion.matches) {
      root.classList.remove('cursor-ready');
      cursor?.classList.remove('is-visible', 'is-view', 'is-action', 'is-explore');
      words.forEach((word) => word.classList.remove('is-active', 'is-past'));
    } else if (finePointer.matches && cursor) root.classList.add('cursor-ready');
    scheduleScrollUpdate();
  });
  syncCinematicMode();
  updateScrollExperiences();

  if (!cursor || !cursorLabel || !cursorIcon || !finePointer.matches || reduceMotion.matches) return;
  root.classList.add('cursor-ready');
  let pointerX = -100;
  let pointerY = -100;
  let pointerFrame = 0;
  function paintPointer() {
    cursor.style.left = `${pointerX}px`;
    cursor.style.top = `${pointerY}px`;
    pointerFrame = 0;
  }
  document.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursor.classList.add('is-visible');
    if (!pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);

    const study = document.querySelector('.hero-study');
    if (hero && study && event.clientY < hero.offsetHeight) {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      study.style.setProperty('--parallax-x', `${(x * 7).toFixed(2)}px`);
      study.style.setProperty('--parallax-y', `${(y * 6).toFixed(2)}px`);
    }
  }, { passive: true });

  function setCursorState(target) {
    cursor.classList.remove('is-view', 'is-action', 'is-explore');
    if (!target) return;
    const isProject = target.matches('.work-scene__visual, .project-link');
    const isService = target.matches('.service__trigger');
    cursorLabel.textContent = isProject ? 'VIEW' : isService ? 'EXPLORE' : '';
    cursor.classList.add(isProject ? 'is-view' : isService ? 'is-explore' : 'is-action');
  }
  document.addEventListener('pointerover', (event) => {
    const target = event.target.closest?.('.work-scene__visual, .project-link, .button, .nav-cta, .work-scene__cta, .text-link, .service__trigger');
    if (!target) return;
    setCursorState(target);
    cursor.classList.add('is-visible');
  });
  document.addEventListener('pointerout', (event) => {
    const leaving = event.target.closest?.('.work-scene__visual, .project-link, .button, .nav-cta, .work-scene__cta, .text-link, .service__trigger');
    const entering = event.relatedTarget?.closest?.('.work-scene__visual, .project-link, .button, .nav-cta, .work-scene__cta, .text-link, .service__trigger');
    if (leaving && !entering) setCursorState(null);
  });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  document.addEventListener('pointerenter', () => cursor.classList.add('is-visible'));

  reduceMotion.addEventListener?.('change', (event) => {
    if (event.matches) {
      root.classList.remove('cursor-ready');
      cursor.classList.remove('is-visible', 'is-view', 'is-action', 'is-explore');
    }
  });
})();

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
  const workSequence = document.querySelector('[data-work-sequence]');
  const workScenes = [...document.querySelectorAll('[data-work-scene]')];
  const workProgress = workSequence?.querySelector('.work-sequence__progress');
  const workProgressFill = workProgress?.querySelector('span');
  const workCurrent = workSequence?.querySelector('[data-work-current]');
  const statement = document.querySelector('#statement');
  const wordSequence = statement?.querySelector('[data-word-sequence]');
  const words = [...(wordSequence?.querySelectorAll('[data-word]') || [])];
  const aiFlow = document.querySelector('.ai-flow');
  const aiSection = aiFlow?.closest('.ai');
  const aiFlowSteps = [...(aiFlow?.querySelectorAll('[data-ai-step]') || [])];
  const aiFlowLine = aiFlow?.querySelector('.ai-flow__line-progress');
  const hero = document.querySelector('.hero');
  const buildStory = document.querySelector('[data-build-story]');
  const buildSteps = [...(buildStory?.querySelectorAll('[data-build-step]') || [])];
  const buildCurrent = buildStory?.querySelector('[data-build-current]');
  const buildLine = buildStory?.querySelector('.build-story__line-progress');
  const scrollStories = [...document.querySelectorAll('[data-scroll-story]')].map((sequence) => ({
    element: sequence,
    steps: [...sequence.querySelectorAll('[data-story-step]')],
    current: sequence.querySelector('[data-story-current]'),
    progress: sequence.querySelector('.story-progress'),
    fill: sequence.querySelector('.story-progress span'),
    activeIndex: -1,
  }));
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
  const servicePreview = document.querySelector('.service-preview');
  const serviceArts = [...(servicePreview?.querySelectorAll('[data-service-art]') || [])];
  const serviceActive = servicePreview?.querySelector('[data-service-active]');
  const serviceCaption = servicePreview?.querySelector('[data-service-caption]');
  let activeServiceIndex = 0;
  function showService(index) {
    const service = services[index];
    const trigger = service?.querySelector('.service__trigger');
    const description = service?.querySelector('.service__detail p')?.textContent || '';
    if (!service || !trigger) return;
    activeServiceIndex = index;
    servicePreview?.setAttribute('data-active-service', String(index + 1).padStart(2, '0'));
    serviceArts.forEach((art) => {
      const active = art.dataset.serviceArt === String(index + 1).padStart(2, '0');
      art.classList.toggle('is-active', active);
      art.setAttribute('aria-hidden', String(!active));
    });
    if (serviceActive) serviceActive.textContent = `${String(index + 1).padStart(2, '0')} / ${trigger.querySelector('.service__title')?.textContent || 'SERVICE'}`;
    if (serviceCaption) serviceCaption.textContent = description;
  }
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
      services.forEach((other) => {
        const otherButton = other.querySelector('.service__trigger');
        const otherDetail = other.querySelector('.service__detail');
        const shouldOpen = other === service;
        other.classList.toggle('is-open', shouldOpen);
        otherButton?.setAttribute('aria-expanded', String(shouldOpen));
        otherDetail?.setAttribute('aria-hidden', String(!shouldOpen));
        otherDetail?.toggleAttribute('inert', !shouldOpen);
      });
      showService(index);
    });
    button.addEventListener('focus', () => showService(index));
    service.addEventListener('pointerenter', () => showService(index));
  });
  if (services.length) showService(0);

  let currentWorkIndex = -1;
  let currentBuildIndex = -1;
  let currentAiIndex = -1;
  let buildPathLength = 1;
  let aiPathLength = 1;
  try {
    buildPathLength = buildLine?.getTotalLength() || 1;
    if (buildLine) {
      buildLine.style.strokeDasharray = `${buildPathLength}`;
      buildLine.style.strokeDashoffset = `${buildPathLength}`;
    }
  } catch { /* Keep the static list if SVG path measurement is unavailable. */ }
  try {
    aiPathLength = aiFlowLine?.getTotalLength() || 1;
    if (aiFlowLine) {
      aiFlowLine.style.strokeDasharray = `${aiPathLength}`;
      aiFlowLine.style.strokeDashoffset = `${aiPathLength}`;
    }
  } catch { /* Keep the static sequence if SVG path measurement is unavailable. */ }

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
  function setStoryActive(story, index) {
    if (index === story.activeIndex) return;
    story.activeIndex = index;
    story.steps.forEach((step, stepIndex) => {
      const active = stepIndex === index;
      step.classList.toggle('is-active', active);
      step.classList.toggle('is-past', stepIndex < index);
      step.inert = !active;
      step.setAttribute('aria-hidden', String(!active));
    });
    const name = story.steps[index]?.dataset.storyTitle || `Step ${index + 1}`;
    const count = story.steps.length;
    if (story.current) story.current.textContent = `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`;
    if (story.progress) {
      story.progress.setAttribute('aria-valuenow', String(index + 1));
      story.progress.setAttribute('aria-valuetext', `${name}, ${index + 1} of ${count}`);
    }
  }

  function syncCinematicMode() {
    const shouldEnable = !reduceMotion.matches && workScenes.length > 0;
    if (shouldEnable === cinematicEnabled) return;
    cinematicEnabled = shouldEnable;
    workSequence?.classList.toggle('is-cinematic', shouldEnable);
    buildStory?.classList.toggle('is-cinematic', shouldEnable);
    scrollStories.forEach((story) => story.element.classList.toggle('is-cinematic', shouldEnable));
    if (shouldEnable) {
      currentWorkIndex = -1;
      currentBuildIndex = -1;
      setWorkActive(0);
      scrollStories.forEach((story) => {
        story.activeIndex = -1;
        setStoryActive(story, 0);
      });
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
      scrollStories.forEach((story) => {
        story.activeIndex = -1;
        story.steps.forEach((step) => {
          step.inert = false;
          step.removeAttribute('aria-hidden');
          step.classList.remove('is-active', 'is-past');
        });
        story.steps[0]?.classList.add('is-active');
      });
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

    if (aiFlow && aiFlowSteps.length) {
      const rect = (aiSection || aiFlow).getBoundingClientRect();
      const progress = clamp((window.innerHeight - rect.top) / (rect.height + window.innerHeight));
      const activeIndex = Math.min(aiFlowSteps.length - 1, Math.max(0, Math.round(progress * (aiFlowSteps.length - 1))));
      if (activeIndex !== currentAiIndex) {
        currentAiIndex = activeIndex;
        aiFlowSteps.forEach((step, index) => {
          step.classList.toggle('is-active', index === activeIndex);
          step.classList.toggle('is-past', index < activeIndex);
          if (index === activeIndex) step.setAttribute('aria-current', 'step');
          else step.removeAttribute('aria-current');
        });
      }
      if (aiFlowLine) aiFlowLine.style.strokeDashoffset = `${aiPathLength * (1 - progress)}`;
    }

    if (cinematicEnabled) scrollStories.forEach((story) => {
      const { element, steps, fill } = story;
      if (!steps.length) return;
      const travel = Math.max(element.offsetHeight - window.innerHeight, 1);
      const progress = clamp(-element.getBoundingClientRect().top / travel);
      const position = progress * (steps.length - 1);
      const baseIndex = Math.min(steps.length - 1, Math.floor(position));
      const transition = baseIndex === steps.length - 1 ? 0 : position - baseIndex;
      const activeIndex = Math.min(steps.length - 1, Math.max(0, Math.round(position)));
      steps.forEach((step, index) => {
        const isBase = index === baseIndex;
        const isIncoming = index === baseIndex + 1 && transition > .001;
        step.style.zIndex = isIncoming ? '4' : isBase ? '3' : '2';
        const opacity = isBase ? 1 - transition : isIncoming ? transition : 0;
        step.style.setProperty('--story-opacity', opacity.toFixed(3));
        step.style.setProperty('--story-x', isIncoming ? `${((1 - transition) * 24).toFixed(1)}px` : isBase ? `${(-transition * 24).toFixed(1)}px` : '0px');
        step.style.setProperty('--story-scale', isIncoming ? `${(.985 + transition * .015).toFixed(3)}` : isBase ? `${(1 - transition * .012).toFixed(3)}` : '.985');
        step.style.setProperty('--story-clip', isIncoming ? `${((1 - transition) * 18).toFixed(1)}%` : '0%');
      });
      setStoryActive(story, activeIndex);
      if (fill) fill.style.transform = `scaleX(${(position + 1) / steps.length})`;
    });
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

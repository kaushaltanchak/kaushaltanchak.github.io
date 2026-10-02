(() => {
  const root = document.documentElement;
  const header = document.querySelector('.site-header');
  const mobileNav = document.querySelector('#mobile-nav');
  const menuSummary = mobileNav?.querySelector('summary');
  const cursor = document.querySelector('.cursor');
  const cursorLabel = cursor?.querySelector('span');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  root.classList.add('js-ready');

  function updateHeader() {
    header?.classList.toggle('is-scrolled', window.scrollY > 32);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  function syncMenu() {
    const isOpen = Boolean(mobileNav?.open);
    document.body.classList.toggle('menu-open', isOpen);
    menuSummary?.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }
  mobileNav?.addEventListener('toggle', syncMenu);
  mobileNav?.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      mobileNav.open = false;
      syncMenu();
    });
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileNav?.open) {
      mobileNav.open = false;
      syncMenu();
      menuSummary?.focus();
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

  if (!cursor || !finePointer.matches || reduceMotion.matches) return;

  root.classList.add('cursor-ready');
  let pointerX = -100;
  let pointerY = -100;
  let framePending = false;

  function paintPointer() {
    cursor.style.left = `${pointerX}px`;
    cursor.style.top = `${pointerY}px`;
    framePending = false;
  }

  document.addEventListener('pointermove', (event) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    cursor.classList.add('is-visible');
    if (!framePending) {
      framePending = true;
      requestAnimationFrame(paintPointer);
    }

    const hero = document.querySelector('.hero');
    const study = document.querySelector('.hero-study');
    if (hero && study && event.clientY < hero.offsetHeight) {
      const rect = hero.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      study.style.setProperty('--parallax-x', `${(x * 8).toFixed(2)}px`);
      study.style.setProperty('--parallax-y', `${(y * 7).toFixed(2)}px`);
    }
  }, { passive: true });

  document.addEventListener('pointerover', (event) => {
    const link = event.target.closest?.('.project-link');
    if (!link) return;
    cursorLabel.textContent = 'VIEW';
    cursor.classList.add('is-view', 'is-visible');
  });
  document.addEventListener('pointerout', (event) => {
    const leavingLink = event.target.closest?.('.project-link');
    const enteringLink = event.relatedTarget?.closest?.('.project-link');
    if (leavingLink && !enteringLink) cursor.classList.remove('is-view');
  });
  document.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  document.addEventListener('pointerenter', () => cursor.classList.add('is-visible'));

  reduceMotion.addEventListener?.('change', (event) => {
    if (event.matches) {
      root.classList.remove('cursor-ready');
      cursor.classList.remove('is-visible', 'is-view');
    }
  });
})();

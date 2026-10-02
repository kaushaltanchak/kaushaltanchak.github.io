(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reducedMotion) {
    document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const items = [...document.querySelectorAll('[data-reveal]')];
  if (!items.length) return;

  const observer = new IntersectionObserver((entries, instance) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      instance.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  items.forEach((element, index) => {
    if (element.classList.contains('project')) {
      element.style.setProperty('--reveal-delay', `${(index % 2) * 90}ms`);
    }
    observer.observe(element);
  });

  root.classList.add('reveal-ready', 'motion-ready');
})();

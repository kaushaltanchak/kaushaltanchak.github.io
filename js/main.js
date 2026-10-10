(() => {
  'use strict';

  const clamp = (value) => Math.max(0, Math.min(1, value));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setupMobileNavigation() {
    const header = document.querySelector('.site-header');
    const toggle = header?.querySelector('.mobile-menu-toggle');
    const desktopNav = header?.querySelector('.desktop-nav');
    if (!header || !toggle || !desktopNav) return;

    let nav = header.querySelector('#mobile-navigation');
    if (!nav) {
      nav = desktopNav.cloneNode(true);
      nav.id = 'mobile-navigation';
      nav.className = 'mobile-nav';
      nav.setAttribute('aria-label', 'Mobile navigation');
      nav.hidden = true;
      const cta = header.querySelector('.header-cta a');
      if (cta) nav.append(cta.cloneNode(true));
      header.append(nav);
    }

    const setMenuIcon = (open) => {
      const oldIcon = toggle.querySelector('svg');
      if (!oldIcon) return;
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '24');
      svg.setAttribute('height', '24');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.setAttribute('class', `lucide lucide-${open ? 'x' : 'menu'}`);
      svg.setAttribute('aria-hidden', 'true');
      (open ? ['M18 6 6 18', 'm6 6 12 12'] : ['M4 5h16', 'M4 12h16', 'M4 19h16']).forEach((pathData) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        svg.append(path);
      });
      oldIcon.replaceWith(svg);
    };
    const closeMenu = (restoreFocus = false) => {
      nav.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      setMenuIcon(false);
      if (restoreFocus) toggle.focus();
    };

    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') !== 'true';
      nav.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      setMenuIcon(open);
      if (open) nav.querySelector('a')?.focus();
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !nav.hidden) closeMenu(true);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 767 && !nav.hidden) closeMenu();
    }, { passive: true });
  }

  function setupProcessAccordion() {
    const descriptions = [
      'Listen first. Understand the brand, the customer and what the current experience is asking them to do.',
      'Agree on the problem, the priorities and what a better experience should make possible.',
      'Shape the journey, the hierarchy and the interface. Make every decision earn its place.',
      'Turn the design into a considered, usable storefront or custom digital experience.',
      'Test the details, check the journeys and bring the experience into the real world.',
      'Listen to what the experience tells us. Improve with intention as the business evolves.'
    ];
    const icon = (expanded) => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '15');
      svg.setAttribute('height', '15');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      svg.setAttribute('stroke-linecap', 'round');
      svg.setAttribute('stroke-linejoin', 'round');
      svg.setAttribute('class', `lucide lucide-${expanded ? 'minus' : 'plus'}`);
      svg.setAttribute('aria-hidden', 'true');
      const horizontal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      horizontal.setAttribute('d', 'M5 12h14');
      svg.append(horizontal);
      if (!expanded) {
        const vertical = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        vertical.setAttribute('d', 'M12 5v14');
        svg.append(vertical);
      }
      return svg;
    };

    document.querySelectorAll('.process-list .process-step').forEach((step, index) => {
      const button = step.querySelector('.process-trigger');
      if (!button || !descriptions[index]) return;
      const id = button.getAttribute('aria-controls') || `process-${index}`;
      button.setAttribute('aria-controls', id);
      let detail = document.getElementById(id);
      if (!detail) {
        detail = document.createElement('p');
        detail.id = id;
        button.insertAdjacentElement('afterend', detail);
      }
      detail.textContent = descriptions[index];
      const expanded = button.getAttribute('aria-expanded') === 'true';
      detail.hidden = !expanded;
      const oldIcon = button.querySelector('svg');
      if (oldIcon) oldIcon.replaceWith(icon(expanded));

      button.addEventListener('click', () => {
        const next = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(next));
        detail.hidden = !next;
        const currentIcon = button.querySelector('svg');
        if (currentIcon) currentIcon.replaceWith(icon(next));
      });
    });
  }

  function setupJourney() {
    const steps = [
      { name: 'DISCOVER', title: 'The first impression.', copy: 'A useful search. A clear point of entry. The right product, before the customer has to ask.' },
      { name: 'EXPLORE', title: 'Room to find their thing.', copy: 'Collections, navigation and filtering that make a range feel approachable — not overwhelming.' },
      { name: 'CHOOSE', title: 'A decision made easier.', copy: 'Clear product information, considered images and variants that make sense in context.' },
      { name: 'TRUST', title: 'Confidence comes first.', copy: 'Useful details, transparent information and reassurance at the moment it matters.' },
      { name: 'BUY', title: 'Less between yes and bought.', copy: 'A clear cart and a considered checkout. No unnecessary detours at the final step.' }
    ];
    const journeys = [...document.querySelectorAll('.journey-vivid')];
    const state = journeys.map((section) => {
      const staticSteps = document.createElement('div');
      staticSteps.className = 'journey-static-steps';
      staticSteps.hidden = true;
      steps.slice(1).forEach((step) => {
        const article = document.createElement('article');
        const label = document.createElement('span');
        label.className = 'eyebrow text-primary';
        label.textContent = step.name;
        const title = document.createElement('h3');
        title.textContent = step.title;
        const copy = document.createElement('p');
        copy.textContent = step.copy;
        article.append(label, title, copy);
        staticSteps.append(article);
      });
      section.querySelector('.journey-sticky .container')?.append(staticSteps);
      return { section, staticSteps, top: 0, height: 0, visibleHeight: 0, stage: -1 };
    });

    const updateStage = (item, stage) => {
      const { section } = item;
      if (item.stage === stage) return;
      item.stage = stage;
      section.dataset.step = String(stage);
      const step = steps[stage];
      const tabs = [...section.querySelectorAll('.journey-tab')];
      tabs.forEach((tab, index) => {
        tab.classList.toggle('active', index === stage);
        if (index === stage) tab.setAttribute('aria-current', 'step');
        else tab.removeAttribute('aria-current');
      });

      const index = section.querySelector('.journey-index');
      const reveal = section.querySelector('.journey-copy-reveal');
      if (index) index.textContent = `0${stage + 1}`;
      if (reveal) {
        const name = reveal.querySelector('.journey-stage-name');
        const title = reveal.querySelector('h3');
        const copy = reveal.querySelector('p');
        if (name) name.textContent = step.name;
        if (title) title.textContent = step.title;
        if (copy) copy.textContent = step.copy;
        reveal.style.animation = 'none';
        void reveal.offsetHeight;
        reveal.style.animation = '';
      }

      const screen = section.querySelector('.journey-screen');
      if (screen) {
        screen.className = screen.className.replace(/\bstage-\d\b/g, '').trim();
        screen.classList.add(`stage-${stage}`);
        const detail = stage >= 2;
        screen.querySelector('.store-toolbar')?.setAttribute('aria-hidden', String(detail));
        screen.querySelector('.store-discovery')?.setAttribute('aria-hidden', String(stage !== 0));
        screen.querySelector('.store-detail')?.setAttribute('aria-hidden', String(stage !== 2));
        screen.querySelector('.store-trust')?.setAttribute('aria-hidden', String(stage !== 3));
        screen.querySelector('.store-cart')?.setAttribute('aria-hidden', String(stage !== 4));
        screen.querySelectorAll('.store-object').forEach((object, objectIndex) => {
          object.setAttribute('aria-hidden', String(detail && objectIndex > 0));
        });
        const filterLabels = screen.querySelectorAll('.ui-filter span');
        if (filterLabels[0]) filterLabels[0].textContent = stage === 0 ? 'CONSIDERED OBJECTS. EVERYDAY RITUALS.' : 'ALL OBJECTS / 03 PRODUCTS';
        if (filterLabels[1]) filterLabels[1].textContent = stage === 0 ? 'DISCOVER ↗' : 'FILTER + / SORT ↓';
      }
    };

    return {
      measure() {
        state.forEach((item) => {
          const rect = item.section.getBoundingClientRect();
          item.top = rect.top + window.scrollY;
          item.height = item.section.offsetHeight;
          item.visibleHeight = item.section.querySelector('.journey-sticky')?.clientHeight || window.innerHeight;
        });
      },
      paint() {
        state.forEach((item) => {
          const position = item.top - window.scrollY;
          const range = Math.max(1, item.height - item.visibleHeight);
          const progress = clamp(-position / range);
          item.section.style.setProperty('--journey-progress', progress.toFixed(4));
          updateStage(item, Math.min(4, Math.floor(progress * 5)));
        });
      },
      setReduced(reduced) {
        state.forEach((item) => {
          item.section.classList.toggle('is-reduced', reduced);
          item.staticSteps.hidden = !reduced;
          if (reduced) {
            item.stage = -1;
            updateStage(item, 0);
          }
        });
      }
    };
  }

  function setupContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;
    const fields = [...form.querySelectorAll('input[name], select[name], textarea[name]')];
    const status = document.createElement('div');
    status.className = 'form-status';
    status.setAttribute('role', 'status');
    status.setAttribute('tabindex', '-1');
    status.hidden = true;
    form.append(status);

    const messages = {
      name: 'Please enter your name.',
      email: 'Please enter a valid email.',
      company: 'Please keep this under 150 characters.',
      website: 'Please enter a full website address, starting with https://.',
      project_type: 'Please select a project type.',
      budget: 'Please select a budget range.',
      details: 'Tell us a little about your project.'
    };
    const validate = (field) => {
      const value = field.value.trim();
      const name = field.name;
      let error = '';
      if (name === 'name' && (!value || value.length > 100)) error = value ? 'Please keep your name under 100 characters.' : messages.name;
      if (name === 'email' && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || value.length > 255)) error = messages.email;
      if (name === 'company' && value.length > 150) error = messages.company;
      if (name === 'website' && value) {
        try {
          const url = new URL(value);
          if (!/^https?:$/.test(url.protocol) || value.length > 500) error = messages.website;
        } catch {
          error = messages.website;
        }
      }
      if (name === 'project_type' && !field.value) error = messages.project_type;
      if (name === 'budget' && !field.value) error = messages.budget;
      if (name === 'details' && (!value || value.length > 5000)) error = value ? 'Please keep project details under 5,000 characters.' : messages.details;

      const wrapper = field.closest('.form-field');
      let errorNode = wrapper?.querySelector('.form-error');
      if (error && wrapper) {
        if (!errorNode) {
          errorNode = document.createElement('p');
          errorNode.className = 'form-error';
          errorNode.id = `${name}-error`;
          errorNode.setAttribute('role', 'alert');
          wrapper.append(errorNode);
        }
        errorNode.textContent = error;
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorNode.id);
      } else {
        errorNode?.remove();
        field.setAttribute('aria-invalid', 'false');
        field.removeAttribute('aria-describedby');
      }
      return error;
    };

    fields.forEach((field) => {
      field.addEventListener('input', () => validate(field));
      field.addEventListener('change', () => validate(field));
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      status.hidden = true;
      const invalid = fields.filter((field) => validate(field));
      if (invalid.length) {
        invalid[0].focus();
        return;
      }

      const values = Object.fromEntries(fields.map((field) => [field.name, field.value.trim()]));
      const subject = `Project enquiry: ${values.project_type}`;
      const body = [
        `Name: ${values.name}`,
        `Email: ${values.email}`,
        `Company / Brand: ${values.company || 'Not provided'}`,
        `Current website: ${values.website || 'Not provided'}`,
        `Project type: ${values.project_type}`,
        `Budget range: ${values.budget}`,
        '',
        'Project details:',
        values.details
      ].join('\n');
      const mailto = `mailto:hello@shopdev.studio?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Your email draft is opening in your mail app. Review the details and send it when you are ready. If it does not open, email hello@shopdev.studio.';
      const fallback = document.createElement('a');
      fallback.href = mailto;
      fallback.textContent = 'Open the email draft';
      fallback.className = 'studio-text';
      status.append(document.createElement('br'), fallback);
      status.hidden = false;
      status.focus();
      window.location.href = mailto;
    });
  }

  function setupMotion(journey) {
    let stop = () => {};
    const setup = () => {
      stop();
      const reduced = reducedMotion.matches;
      document.body.classList.toggle('motion-ready', !reduced);
      journey.setReduced(reduced);
      if (reduced) return;

      const visible = new Set();
      let scenes = [];
      let reveals = [];
      let needsMeasure = true;
      let frame = 0;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        schedule();
      }, { rootMargin: '160px 0px' });

      const measure = () => {
        scenes = [...document.querySelectorAll('[data-motion]')].map((element) => {
          observer.observe(element);
          const rect = element.getBoundingClientRect();
          return { element, top: rect.top + window.scrollY, height: rect.height };
        });
        reveals = [...document.querySelectorAll('.scroll-reveal:not(.in-view)')].map((element) => ({
          element,
          top: element.getBoundingClientRect().top + window.scrollY
        }));
        journey.measure();
        needsMeasure = false;
      };
      const paint = () => {
        frame = 0;
        if (needsMeasure) measure();
        const y = window.scrollY;
        const vh = window.innerHeight;
        reveals = reveals.filter(({ element, top }) => {
          if (top < y + vh * 0.96) {
            element.classList.add('in-view');
            return false;
          }
          return true;
        });
        scenes.forEach(({ element, top, height }) => {
          if (!visible.has(element)) return;
          const progress = clamp((y + vh - top) / (vh + height));
          const enter = clamp((y + vh - top) / (vh * 0.85));
          const timeline = clamp((y - top) / Math.max(1, height - Math.min(vh, 950)));
          element.style.setProperty('--scene-progress', progress.toFixed(4));
          element.style.setProperty('--scene-enter', enter.toFixed(4));
          element.style.setProperty('--scene-timeline', timeline.toFixed(4));
        });
        journey.paint();
      };
      const schedule = () => {
        if (!frame) frame = requestAnimationFrame(paint);
      };
      const remeasure = () => {
        needsMeasure = true;
        schedule();
      };
      const resize = new ResizeObserver(remeasure);
      resize.observe(document.documentElement);
      const mutations = new MutationObserver(remeasure);
      mutations.observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
      window.addEventListener('scroll', schedule, { passive: true });
      window.addEventListener('resize', remeasure, { passive: true });
      document.addEventListener('load', remeasure, true);
      document.fonts?.ready.then(remeasure);
      schedule();
      stop = () => {
        observer.disconnect();
        resize.disconnect();
        mutations.disconnect();
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', remeasure);
        document.removeEventListener('load', remeasure, true);
        cancelAnimationFrame(frame);
      };
    };

    setup();
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', setup);
    else reducedMotion.addListener(setup);
  }

  setupMobileNavigation();
  setupProcessAccordion();
  setupContactForm();
  setupMotion(setupJourney());
})();

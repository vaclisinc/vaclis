const nav = document.getElementById('nav');
const toggle = document.getElementById('nav-toggle');
const links = document.getElementById('nav-links');

function updateNav() {
  nav.classList.toggle('scrolled', window.scrollY > 24);
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

if (toggle && links) {
  toggle.addEventListener('click', function () {
    const isOpen = toggle.classList.toggle('open');
    links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggle.classList.remove('open');
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(function (link) {
  const href = link.getAttribute('href');
  if (href === currentPage) {
    link.classList.add('active');
    link.setAttribute('aria-current', 'page');
  }
});

const fadeEls = document.querySelectorAll('.fade-in');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -8% 0px' });

  fadeEls.forEach(function (element) { observer.observe(element); });
} else {
  fadeEls.forEach(function (element) { element.classList.add('visible'); });
}

setTimeout(function () {
  document.querySelectorAll('.fade-in:not(.visible)').forEach(function (element) {
    element.classList.add('visible');
  });
}, 900);

if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  fadeEls.forEach(function (element) { element.classList.add('visible'); });
}

const researchTabs = Array.from(document.querySelectorAll('[data-research-view]'));
const researchPanels = Array.from(document.querySelectorAll('[data-research-panel]'));
const researchTopicLinks = Array.from(document.querySelectorAll('[data-taste-target]'));

if (researchTabs.length && researchPanels.length) {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setResearchView(view, shouldAnimate) {
    const previousView = researchTabs.find(function (tab) {
      return tab.getAttribute('aria-selected') === 'true';
    });

    researchTabs.forEach(function (tab) {
      const isActive = tab.dataset.researchView === view;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    researchPanels.forEach(function (panel) {
      panel.hidden = panel.dataset.researchPanel !== view;
    });

    const activePanel = researchPanels.find(function (panel) {
      return panel.dataset.researchPanel === view;
    });

    if (shouldAnimate && activePanel && previousView && previousView.dataset.researchView !== view && !reduceMotion) {
      const directionClass = view === 'taste' ? 'research-enter-from-right' : 'research-enter-from-left';
      activePanel.classList.remove('research-enter-from-right', 'research-enter-from-left');
      void activePanel.offsetWidth;
      activePanel.classList.add(directionClass);
      activePanel.addEventListener('animationend', function () {
        activePanel.classList.remove(directionClass);
      }, { once: true });
    }
  }

  function scrollToResearchTop() {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  researchTabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      const view = tab.dataset.researchView;
      setResearchView(view, true);
      history.replaceState(null, '', view === 'taste' ? '#taste' : '#work');
      scrollToResearchTop();
    });

    tab.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      const direction = event.key === 'ArrowRight' ? 1 : -1;
      const nextTab = researchTabs[(index + direction + researchTabs.length) % researchTabs.length];
      nextTab.focus();
      nextTab.click();
    });
  });

  researchTopicLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      const target = document.getElementById(link.dataset.tasteTarget);
      if (!target) return;
      setResearchView('taste', true);
      history.replaceState(null, '', '#' + target.id);
      window.requestAnimationFrame(function () {
        target.focus({ preventScroll: true });
        target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });
  });

  const initialTarget = window.location.hash.slice(1);
  if (initialTarget === 'taste' || initialTarget.indexOf('taste-') === 0) {
    setResearchView('taste', false);
  } else {
    setResearchView('work', false);
  }
}

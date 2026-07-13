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

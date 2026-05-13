// Sticky nav scroll effect
const nav = document.getElementById('nav');

function updateNav() {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

// Mobile hamburger menu
const toggle = document.getElementById('nav-toggle');
const links = document.getElementById('nav-links');

toggle.addEventListener('click', function () {
  toggle.classList.toggle('open');
  links.classList.toggle('open');
});

// Close mobile menu when a link is clicked
links.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    toggle.classList.remove('open');
    links.classList.remove('open');
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
  var scrollPos = window.scrollY + 100;

  sections.forEach(function (section) {
    var id = section.getAttribute('id');
    if (!id) return;

    var top = section.offsetTop;
    var height = section.offsetHeight;

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
updateActiveLink();

// Fade-in on scroll with IntersectionObserver
var fadeEls = document.querySelectorAll('.fade-in');

if ('IntersectionObserver' in window) {
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
  );

  fadeEls.forEach(function (el) {
    observer.observe(el);
  });
} else {
  fadeEls.forEach(function (el) { el.classList.add('visible'); });
}

// Safety net: if any .fade-in hasn't been revealed within ~1s
// (e.g. screenshot capture, printing, or reading without scrolling),
// force-show them so content never stays invisible.
setTimeout(function () {
  document.querySelectorAll('.fade-in:not(.visible)').forEach(function (el) {
    el.classList.add('visible');
  });
}, 1000);

// Respect users who prefer reduced motion — skip the animation entirely.
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  fadeEls.forEach(function (el) { el.classList.add('visible'); });
}

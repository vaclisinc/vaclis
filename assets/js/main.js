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
    { threshold: 0.15 }
  );

  fadeEls.forEach(function (el) {
    observer.observe(el);
  });
} else {
  // Fallback: show everything
  fadeEls.forEach(function (el) {
    el.classList.add('visible');
  });
}

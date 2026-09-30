const masthead = document.getElementById('masthead');
const themeToggle = document.getElementById('theme-toggle');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');

function activeTheme() {
  return document.documentElement.dataset.theme || (systemTheme.matches ? 'dark' : 'light');
}

function updateThemeToggle() {
  if (!themeToggle) return;
  const isDark = activeTheme() === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  themeToggle.setAttribute('aria-label', label);
  themeToggle.setAttribute('title', label);
  themeToggle.classList.toggle('is-dark', isDark);
}

if (themeToggle) {
  themeToggle.addEventListener('click', function () {
    const nextTheme = activeTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nextTheme;
    try { localStorage.setItem('theme', nextTheme); } catch (error) { /* Storage may be unavailable. */ }
    updateThemeToggle();
  });
  systemTheme.addEventListener('change', updateThemeToggle);
  updateThemeToggle();
}

if (masthead) {
  const updateMasthead = function () { masthead.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', updateMasthead, { passive: true });
  updateMasthead();
}


const figureViewer = document.getElementById('figure-viewer');
if (figureViewer) {
  const viewerImage = figureViewer.querySelector('.figure-viewer-image');
  const viewerCaption = document.getElementById('figure-viewer-caption');

  document.querySelectorAll('.pub-image[data-full-image]').forEach(function (button) {
    button.addEventListener('click', function () {
      viewerImage.src = button.dataset.fullImage;
      viewerImage.alt = button.querySelector('img').alt;
      viewerCaption.textContent = button.closest('.pub').querySelector('.pub-title').textContent;
      figureViewer.showModal();
      document.documentElement.classList.add('figure-view-open');
    });
  });

  figureViewer.querySelector('.figure-viewer-close').addEventListener('click', function () {
    figureViewer.close();
  });
  figureViewer.addEventListener('click', function (event) {
    if (event.target !== figureViewer) return;
    const bounds = figureViewer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) {
      figureViewer.close();
    }
  });
  figureViewer.addEventListener('close', function () {
    document.documentElement.classList.remove('figure-view-open');
  });
}

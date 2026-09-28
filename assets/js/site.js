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

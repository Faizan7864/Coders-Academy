/* ============================================================
   js/ui.js  –  Navigation, toast notifications, particles,
                config application
   ============================================================ */

'use strict';

/* ---------- Navigation ---------- */
function navigateTo(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

  const targetPage = document.getElementById(`page-${page}`);
  if (targetPage) targetPage.classList.remove('hidden');

  // Guard: dashboard requires login
  if (page === 'dashboard' && !currentUser) {
    showAuthModal('login');
    return;
  }

  if (page === 'dashboard') {
    updateDashboard();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- Toast Notifications ---------- */
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast     = document.createElement('div');

  const colorMap = {
    success: 'bg-green-500',
    error:   'bg-red-500',
    info:    'bg-indigo-500'
  };

  toast.className  = `toast ${colorMap[type] || colorMap.info} px-6 py-3 rounded-xl text-white font-medium shadow-lg`;
  toast.textContent = message;

  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ---------- Particle Generator ---------- */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 20; i++) {
    const particle              = document.createElement('div');
    particle.className          = 'particle';
    particle.style.left         = Math.random() * 100 + '%';
    particle.style.animationDelay    = Math.random() * 15 + 's';
    particle.style.animationDuration = (10 + Math.random() * 10) + 's';
    container.appendChild(particle);
  }
}

/* ---------- Apply Config (colors + text) ---------- */
function applyConfig() {
  const academyName   = config.academy_name    || defaultConfig.academy_name;
  const heroTitle     = config.hero_title      || defaultConfig.hero_title;
  const heroSubtitle  = config.hero_subtitle   || defaultConfig.hero_subtitle;
  const bgColor       = config.background_color || defaultConfig.background_color;
  const surfaceColor  = config.surface_color   || defaultConfig.surface_color;
  const textColor     = config.text_color      || defaultConfig.text_color;
  const primaryColor  = config.primary_color   || defaultConfig.primary_color;
  const secondaryColor = config.secondary_color || defaultConfig.secondary_color;

  // CSS variables
  const root = document.documentElement;
  root.style.setProperty('--bg-primary',       bgColor);
  root.style.setProperty('--bg-secondary',     surfaceColor);
  root.style.setProperty('--text-primary',     textColor);
  root.style.setProperty('--accent-primary',   primaryColor);
  root.style.setProperty('--accent-secondary', secondaryColor);

  document.body.style.background = bgColor;
  document.body.style.color      = textColor;

  // Text content
  const navName = document.getElementById('nav-academy-name');
  if (navName) navName.textContent = academyName;

  const heroTitleEl = document.getElementById('hero-title');
  if (heroTitleEl) {
    heroTitleEl.innerHTML = heroTitle.replace(
      'Coding',
      '<span class="gradient-text">Coding</span>'
    );
  }

  const heroSubtitleEl = document.getElementById('hero-subtitle');
  if (heroSubtitleEl) heroSubtitleEl.textContent = heroSubtitle;
}

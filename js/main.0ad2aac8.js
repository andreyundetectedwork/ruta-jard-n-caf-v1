// Ruta Jardín Café - Interactive Logic

document.addEventListener('DOMContentLoaded', () => {

  // Dynamic Year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Mobile Menu Toggle
  const burger = document.querySelector('.js-burger');
  const nav = document.querySelector('.js-nav');
  const navLinks = document.querySelectorAll('.js-nav-link');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-active');
      nav.classList.toggle('is-open');
      document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('is-active');
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  // Menu Category Filter Tabs
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuCategories = document.querySelectorAll('.menu-category');

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      menuTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      menuCategories.forEach(cat => {
        if (cat.id === targetId) {
          cat.classList.add('active');
        } else {
          cat.classList.remove('active');
        }
      });
    });
  });

  // Dynamic Opening Hours Status Check (Argentina UTC-3)
  function updateOpenStatus() {
    const statusEl = document.querySelector('.js-open-status');
    if (!statusEl) return;

    // Get current time in Buenos Aires (America/Argentina/Buenos_Aires)
    const now = new Date();
    const options = { timeZone: 'America/Argentina/Buenos_Aires', hour12: false, weekday: 'short', hour: '2-digit', minute: '2-digit' };
    const formatter = new Intl.DateTimeFormat('es-AR', options);
    const parts = formatter.formatToParts(now);

    let weekday = '';
    let hour = 0;
    let minute = 0;

    parts.forEach(part => {
      if (part.type === 'weekday') weekday = part.value.toLowerCase();
      if (part.type === 'hour') hour = parseInt(part.value, 10);
      if (part.type === 'minute') minute = parseInt(part.value, 10);
    });

    const timeInMinutes = hour * 60 + minute;

    // Schedule matrix in minutes
    // Mon-Fri: 8:30 (510) - 20:00 (1200)
    // Sat: 9:30 (570) - 20:00 (1200)
    // Sun: 12:00 (720) - 18:00 (1080)

    let isOpen = false;

    if (weekday.includes('lun') || weekday.includes('mar') || weekday.includes('mié') || weekday.includes('jue') || weekday.includes('vie')) {
      if (timeInMinutes >= 510 && timeInMinutes < 1200) isOpen = true;
    } else if (weekday.includes('sáb')) {
      if (timeInMinutes >= 570 && timeInMinutes < 1200) isOpen = true;
    } else if (weekday.includes('dom')) {
      if (timeInMinutes >= 720 && timeInMinutes < 1080) isOpen = true;
    }

    if (isOpen) {
      statusEl.classList.remove('is-closed');
      statusEl.querySelector('.status-text').textContent = 'Abierto ahora (Hasta las 20:00 hs)';
    } else {
      statusEl.classList.add('is-closed');
      statusEl.querySelector('.status-text').textContent = 'Cerrado ahora • Abre 8:30 hs';
    }
  }

  updateOpenStatus();
});
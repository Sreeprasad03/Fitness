document.addEventListener('DOMContentLoaded', () => {

  // ── HAMBURGER MENU ──
  const nav       = document.querySelector('nav');
  const hamburger = document.querySelector('.hamburger');
  const navLinks  = document.querySelector('.nav-links');

  function closeMenu() {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
    hamburger.classList.remove('active');
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navLinks.classList.toggle('open');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      hamburger.classList.toggle('active', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !nav.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // ── ACTIVE NAV LINK ──
  const cur = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === cur) a.classList.add('active');
  });

  // ── SCROLL REVEAL ──
  const ro = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

  // ── COUNTER ANIMATION ──
  const co = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = parseInt(el.dataset.count);
      const suf = el.dataset.suffix || '';
      let n = 0;
      const step = Math.max(1, Math.ceil(end / 55));
      const t = setInterval(() => {
        n = Math.min(n + step, end);
        el.textContent = n + suf;
        if (n >= end) clearInterval(t);
      }, 22);
      co.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

});

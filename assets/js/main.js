/* ============================================
   BYSCORE FITNESS — Main JavaScript
============================================ */

// ========== --vh fix for iOS Safari ==========
function setVh() {
  document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
}
setVh();
window.addEventListener('orientationchange', () => setTimeout(setVh, 300));
window.addEventListener('resize', setVh);

// ========== Touch device detection ==========
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  document.documentElement.classList.add('is-touch');
}

document.addEventListener('DOMContentLoaded', () => {

  // ========== Navbar Scroll Effect ==========
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ========== Mobile Navigation ==========
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  function openMobileNav() {
    navToggle.classList.add('open');
    mobileNav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    navToggle.classList.remove('open');
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mobileNav.classList.contains('open') ? closeMobileNav() : openMobileNav();
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    mobileNav.addEventListener('click', (e) => {
      if (e.target === mobileNav) closeMobileNav();
    });

    // Swipe left to close
    let swipeStartX = 0;
    mobileNav.addEventListener('touchstart', (e) => {
      swipeStartX = e.touches[0].clientX;
    }, { passive: true });
    mobileNav.addEventListener('touchend', (e) => {
      if (swipeStartX - e.changedTouches[0].clientX > 60) closeMobileNav();
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileNav();
    });
  }

  // ========== Active Nav Link ==========
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ========== Scroll Reveal ==========
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay) || 0;
          setTimeout(() => el.classList.add('visible'), delay);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ========== Stagger Reveals ==========
  document.querySelectorAll('[data-stagger]').forEach(container => {
    container.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((child, i) => {
      child.dataset.delay = i * 100;
    });
  });

  // ========== Counter Animation ==========
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if ('IntersectionObserver' in window && counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          const step = target / (1500 / 16);
          let current = 0;
          const timer = setInterval(() => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current) + suffix;
            if (current >= target) clearInterval(timer);
          }, 16);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => countObserver.observe(el));
  }

  // ========== Ticker Duplication ==========
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) tickerTrack.innerHTML += tickerTrack.innerHTML;

  // ========== Contact Form ==========
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const successMsg = document.getElementById('formSuccess');
      const originalText = btn.textContent;
      btn.textContent = 'Sending...';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = 'Message Sent ✓';
        if (successMsg) successMsg.style.display = 'block';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          if (successMsg) successMsg.style.display = 'none';
        }, 4000);
      }, 1500);
    });
  }

  // ========== Gallery Lightbox ==========
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const label = item.dataset.label || 'Gallery';
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.96);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer';
      overlay.innerHTML = `<div style="text-align:center;padding:2rem;"><div style="font-family:'Bebas Neue',sans-serif;font-size:clamp(3rem,12vw,8rem);color:#e8ff00;line-height:1;margin-bottom:1rem;">${label}</div><div style="font-family:'Barlow Condensed',sans-serif;color:#888;letter-spacing:0.2em;text-transform:uppercase;font-size:0.8rem;">Tap to close</div></div>`;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', () => overlay.remove());
    });
  });

  // ========== Smooth Page Transitions ==========
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') ||
        href.startsWith('mailto') || href.startsWith('tel') ||
        href.startsWith('https') || link.hasAttribute('target')) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.2s ease';
      setTimeout(() => { window.location.href = href; }, 200);
    });
  });

  // Fade in on load
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.4s ease';
    document.body.style.opacity = '1';
  });

  // ========== Parallax (desktop only) ==========
  if (window.matchMedia('(min-width: 769px)').matches) {
    const hero = document.querySelector('.hero');
    if (hero) {
      window.addEventListener('scroll', () => {
        const heroBg = hero.querySelector('.hero-bg');
        if (heroBg) heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }, { passive: true });
    }
  }

  // ========== Pricing Billing Toggle ==========
  const billingToggle = document.getElementById('billingToggle');
  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const isAnnual = billingToggle.checked;
      const label = document.getElementById('billingLabel');
      document.querySelectorAll('.price-monthly').forEach(el => el.style.display = isAnnual ? 'none' : 'flex');
      document.querySelectorAll('.price-annual').forEach(el => el.style.display = isAnnual ? 'flex' : 'none');
      if (label) label.textContent = isAnnual ? 'Annual' : 'Monthly';
    });
  }

});

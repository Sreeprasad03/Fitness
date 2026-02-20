/* ============================================
   IRONCLAD GYM - Main JavaScript
============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ========== Navbar Scroll Effect ==========
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // ========== Mobile Navigation ==========
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => observer.observe(el));

  // ========== Stagger Reveals ==========
  document.querySelectorAll('[data-stagger]').forEach(container => {
    const children = container.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    children.forEach((child, i) => {
      child.dataset.delay = i * 100;
    });
  });

  // ========== Counter Animation ==========
  const counters = document.querySelectorAll('.stat-num[data-count]');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1500;
        const step = target / (duration / 16);
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

  // ========== Ticker Duplication ==========
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    const clone = tickerTrack.innerHTML;
    tickerTrack.innerHTML += clone;
  }

  // ========== Contact Form ==========
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('[type="submit"]');
      const successMsg = document.getElementById('formSuccess');

      btn.textContent = 'Sending...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'Message Sent ✓';
        if (successMsg) {
          successMsg.style.display = 'block';
        }
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = 'Send Message';
          btn.disabled = false;
          if (successMsg) successMsg.style.display = 'none';
        }, 4000);
      }, 1500);
    });
  }

  // ========== Gallery Lightbox ==========
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      // Simple lightbox effect
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position:fixed;inset:0;background:rgba(0,0,0,0.95);z-index:9999;
        display:flex;align-items:center;justify-content:center;cursor:pointer;
        animation: fadeIn 0.3s ease;
      `;
      const label = item.dataset.label || 'Gallery Image';
      overlay.innerHTML = `
        <div style="text-align:center;padding:2rem;">
          <div style="font-family:'Bebas Neue',sans-serif;font-size:8rem;color:#e8ff00;line-height:1;margin-bottom:1rem;">${label}</div>
          <div style="font-family:'Barlow Condensed',sans-serif;color:#888;letter-spacing:0.2em;text-transform:uppercase;font-size:0.8rem;">Click to close</div>
        </div>
      `;
      document.body.appendChild(overlay);
      overlay.addEventListener('click', () => overlay.remove());
    });
  });

  // ========== Smooth Page Transitions ==========
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.2s ease';
        setTimeout(() => {
          window.location.href = href;
        }, 200);
      });
    }
  });

  // Fade in on load
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  // ========== Parallax Effect (Hero) ==========
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroBg = hero.querySelector('.hero-bg');
      if (heroBg) {
        heroBg.style.transform = `translateY(${scrollY * 0.3}px)`;
      }
    });
  }

  // ========== Pricing Toggle ==========
  const billingToggle = document.getElementById('billingToggle');
  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const monthly = document.querySelectorAll('.price-monthly');
      const annual = document.querySelectorAll('.price-annual');
      const label = document.getElementById('billingLabel');

      if (billingToggle.checked) {
        monthly.forEach(el => el.style.display = 'none');
        annual.forEach(el => el.style.display = 'flex');
        if (label) label.textContent = 'Annual';
      } else {
        monthly.forEach(el => el.style.display = 'flex');
        annual.forEach(el => el.style.display = 'none');
        if (label) label.textContent = 'Monthly';
      }
    });
  }

});

// ========== Mobile UX Improvements ==========

// Prevent address bar resize from triggering layout shifts on mobile
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
// Only update on orientation change, not scroll
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, 300);
});

// Close mobile nav on back button press
window.addEventListener('popstate', () => {
  const mobileNav = document.getElementById('mobileNav');
  const navToggle = document.getElementById('navToggle');
  if (mobileNav && mobileNav.classList.contains('open')) {
    mobileNav.classList.remove('open');
    navToggle && navToggle.classList.remove('open');
    document.body.style.overflow = '';
  }
});

// Swipe to close mobile nav
let touchStartX = 0;
document.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
  const mobileNav = document.getElementById('mobileNav');
  const navToggle = document.getElementById('navToggle');
  if (!mobileNav || !mobileNav.classList.contains('open')) return;
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (diff > 60) { // swipe left to close
    mobileNav.classList.remove('open');
    navToggle && navToggle.classList.remove('open');
    document.body.style.overflow = '';
  }
}, { passive: true });

// Detect touch device and add class for CSS hooks
if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  document.documentElement.classList.add('is-touch');
}

// Fix: prevent double-tap zoom on buttons on iOS
document.querySelectorAll('.btn, button').forEach(el => {
  el.addEventListener('touchend', (e) => {
    e.preventDefault();
    el.click();
  }, { passive: false });
});

// Lazy-load reveal: use requestAnimationFrame on mobile for smoother animations
if (window.innerWidth < 768) {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  });
}

// ========== Mobile UX Improvements ==========
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }, 300);
});

// Swipe to close mobile nav
let touchStartX = 0;
document.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', (e) => {
  const mobileNav = document.getElementById('mobileNav');
  const navToggle = document.getElementById('navToggle');
  if (!mobileNav || !mobileNav.classList.contains('open')) return;
  if (touchStartX - e.changedTouches[0].clientX > 60) {
    mobileNav.classList.remove('open');
    navToggle && navToggle.classList.remove('open');
    document.body.style.overflow = '';
  }
}, { passive: true });

if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
  document.documentElement.classList.add('is-touch');
}

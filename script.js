/* ══════════════════════════════════════════════════════
   BRAIN STORMERS — MAIN JAVASCRIPT
   script.js
══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────────────
   1. DOM READY
───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initHeroParticles();
  initScrollReveal();
  initCounters();
  initSmoothScroll();
  initActiveNavLink();
  initBackToTop();
  initGalleryHover();
  initNavScrollEffect();
});


/* ─────────────────────────────────────────────────────
   2. NAVBAR — SCROLL SHADOW + ACTIVE LINK
───────────────────────────────────────────────────── */
function initNavScrollEffect() {
  const navbar = document.getElementById('navbar');
  const scrollThreshold = 60;

  const onScroll = throttle(() => {
    if (window.scrollY > scrollThreshold) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, 50);

  window.addEventListener('scroll', onScroll, { passive: true });
}

function initNavbar() {
  // Close mobile nav on nav-link click
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => closeMobileNav());
  });
}


/* ─────────────────────────────────────────────────────
   3. HAMBURGER MENU
───────────────────────────────────────────────────── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const overlay = document.getElementById('navOverlay');
  let isOpen = false;

  hamburger.addEventListener('click', () => {
    isOpen ? closeMobileNav() : openMobileNav();
  });

  overlay.addEventListener('click', () => closeMobileNav());

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeMobileNav();
  });

  function openMobileNav() {
    isOpen = true;
    hamburger.classList.add('open');
    navMenu.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  }

  // Expose globally for nav link click handler
  window._closeMobileNav = function () {
    isOpen = false;
    hamburger.classList.remove('open');
    navMenu.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };
}

function closeMobileNav() {
  if (window._closeMobileNav) window._closeMobileNav();
}


/* ─────────────────────────────────────────────────────
   4. HERO PARTICLES
───────────────────────────────────────────────────── */
function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const particleCount = window.innerWidth < 640 ? 12 : 24;

  for (let i = 0; i < particleCount; i++) {
    createParticle(container);
  }
}

function createParticle(container) {
  const p = document.createElement('div');
  p.classList.add('particle');

  const size = randomBetween(4, 20);
  const left = randomBetween(0, 100);
  const delay = randomBetween(0, 18);
  const dur = randomBetween(12, 28);

  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    bottom: -${size}px;
    animation-duration: ${dur}s;
    animation-delay: ${delay}s;
    opacity: ${randomBetween(0.03, 0.12)};
  `;
  container.appendChild(p);
}


/* ─────────────────────────────────────────────────────
   5. SCROLL REVEAL
───────────────────────────────────────────────────── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.scroll-reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    elements.forEach(el => el.classList.add('revealed'));
  }
}


/* ─────────────────────────────────────────────────────
   6. COUNTER ANIMATION
───────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000; // ms
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}


/* ─────────────────────────────────────────────────────
   7. SMOOTH SCROLL (enhanced with offset)
───────────────────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      closeMobileNav();

      const navHeight = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-height'), 10) || 76;

      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
    });
  });
}


/* ─────────────────────────────────────────────────────
   8. ACTIVE NAV LINK (Intersection Observer)
───────────────────────────────────────────────────── */
function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const setActive = (id) => {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${id}`);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActive(entry.target.id);
      }
    });
  }, {
    rootMargin: '-30% 0px -65% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));
}


/* ─────────────────────────────────────────────────────
   9. BACK TO TOP
───────────────────────────────────────────────────── */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  const onScroll = throttle(() => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, 100);

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}


/* ─────────────────────────────────────────────────────
   10. GALLERY HOVER TILT EFFECT
───────────────────────────────────────────────────── */
function initGalleryHover() {
  const items = document.querySelectorAll('.gallery-item');

  items.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * 5;
      const rotY = dx * 5;

      item.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
}


/* ─────────────────────────────────────────────────────
   11. FEATURE CARD STAGGER ON SCROLL
───────────────────────────────────────────────────── */
(function initFeatureStagger() {
  // Already handled by CSS scroll-reveal + IntersectionObserver above.
  // Additional: add ripple effect on feature cards
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        top: ${e.clientY - rect.top - size / 2}px;
        left: ${e.clientX - rect.left - size / 2}px;
        background: rgba(10,42,102,0.07);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.55s ease-out forwards;
        pointer-events: none;
        z-index: 0;
      `;
      this.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inject ripple keyframe
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: scale(2); opacity: 0; }
    }
    .feature-card { overflow: hidden; position: relative; }
  `;
  document.head.appendChild(style);
})();


/* ─────────────────────────────────────────────────────
   12. NAVBAR BRAND ANIMATED ON HOVER
───────────────────────────────────────────────────── */
(function initBrandAnimation() {
  const brand = document.querySelector('.nav-brand .brand-icon');
  if (!brand) return;

  brand.addEventListener('mouseenter', () => {
    brand.style.transform = 'rotate(10deg) scale(1.1)';
    brand.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });
  brand.addEventListener('mouseleave', () => {
    brand.style.transform = '';
  });
})();


/* ─────────────────────────────────────────────────────
   13. FLOATING BADGE PARALLAX on SCROLL
───────────────────────────────────────────────────── */
(function initParallax() {
  const badge = document.querySelector('.about-badge-floating');
  if (!badge) return;

  const onScroll = throttle(() => {
    const rect = badge.getBoundingClientRect();
    const center = window.innerHeight / 2;
    const offset = (rect.top - center) / center;
    badge.style.transform = `translateY(${offset * -12}px)`;
  }, 16);

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ─────────────────────────────────────────────────────
   14. HERO SCROLL PARALLAX
───────────────────────────────────────────────────── */
(function initHeroParallax() {
  const heroContainer = document.querySelector('.hero-container');
  if (!heroContainer) return;

  const onScroll = throttle(() => {
    const scrolled = window.scrollY;
    heroContainer.style.transform = `translateY(${scrolled * 0.18}px)`;
    heroContainer.style.opacity = 1 - scrolled / (window.innerHeight * 0.85);
  }, 16);

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ─────────────────────────────────────────────────────
   15. PROGRAM CARD 3D TILT
───────────────────────────────────────────────────── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.program-card, .stat-card, .testimonial-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      card.style.transition = 'transform 0.05s ease';
      card.style.transform = `perspective(700px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) translateZ(8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1)';
      card.style.transform = '';
    });
  });
})();


/* ─────────────────────────────────────────────────────
   16. TYPEWRITER EFFECT for Hero Tagline
───────────────────────────────────────────────────── */
(function initTypewriter() {
  const el = document.querySelector('.hero-tagline');
  if (!el) return;

  const originalText = el.textContent.trim();
  el.textContent = '';
  el.style.borderRight = '2px solid rgba(255,140,0,0.7)';
  el.style.animation = 'none';
  el.style.opacity = '1';
  el.style.transform = 'none';

  let i = 0;
  let started = false;

  function type() {
    if (i < originalText.length) {
      el.textContent += originalText.charAt(i);
      i++;
      setTimeout(type, 35);
    } else {
      // Blink then remove cursor
      setTimeout(() => {
        el.style.borderRight = 'none';
      }, 1200);
    }
  }

  // Start after hero animation delay
  setTimeout(() => {
    el.style.opacity = '1';
    type();
  }, 600);
})();


/* ─────────────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────────────── */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}


/* ─────────────────────────────────────────────────────
   17. PRELOADER (subtle page entrance)
───────────────────────────────────────────────────── */
(function initPageEntrance() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });

  // Fallback
  setTimeout(() => { document.body.style.opacity = '1'; }, 800);
})();


/* ─────────────────────────────────────────────────────
   18. STICKY NAV PROGRESS BAR (reading progress)
───────────────────────────────────────────────────── */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.id = 'readProgress';
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #0A2A66, #FF8C00);
    z-index: 9999;
    width: 0%;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  const onScroll = throttle(() => {
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docH > 0 ? (window.scrollY / docH) * 100 : 0;
    bar.style.width = `${scrolled}%`;
  }, 16);

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ─────────────────────────────────────────────────────
   19. ENROLL BUTTON PULSE ANIMATION
───────────────────────────────────────────────────── */
(function initEnrollPulse() {
  const style = document.createElement('style');
  style.textContent = `
    .btn-enroll {
      position: relative;
    }
    .btn-enroll::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 99px;
      border: 2px solid rgba(255,140,0,0.5);
      animation: enrollPulse 2.5s ease-in-out infinite;
      pointer-events: none;
    }
    @keyframes enrollPulse {
      0%, 100% { transform: scale(1); opacity: 0.6; }
      50%       { transform: scale(1.07); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
})();


/* ─────────────────────────────────────────────────────
   20. SECTION TAG SLIDE-IN ANIMATION
───────────────────────────────────────────────────── */
(function initSectionTags() {
  const tags = document.querySelectorAll('.section-tag');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'tagSlideIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const style = document.createElement('style');
  style.textContent = `
    .section-tag {
      opacity: 0;
      transform: translateX(-12px);
    }
    @keyframes tagSlideIn {
      to { opacity: 1; transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);

  tags.forEach(tag => observer.observe(tag));
})();

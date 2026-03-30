/* ============================================================
   BRAIN STORMERS — script.js
   Navbar, AOS, Counter, Slider, Back-to-top, Smooth nav
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ─── NAVBAR SCROLL & ACTIVE LINKS ─── */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    updateNavbar();
    updateActiveLink();
    revealOnScroll();
    handleCounter();
    handleBackToTop();
  }, { passive: true });

  updateNavbar();

  /* ─── SMOOTH SCROLL FOR ALL ANCHOR LINKS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 76;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });

        // Close mobile menu if open
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  /* ─── HAMBURGER MENU ─── */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navMenu.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      hamburger.classList.remove('open');
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ─── SCROLL DOWN BUTTON ─── */
  const scrollDown = document.getElementById('scrollDown');
  if (scrollDown) {
    scrollDown.addEventListener('click', () => {
      const whySection = document.getElementById('why');
      if (whySection) {
        const top = whySection.getBoundingClientRect().top + window.scrollY - 76;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  }

  /* ─── CUSTOM AOS (Animate on Scroll) ─── */
  function revealOnScroll() {
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const visible = rect.top < window.innerHeight - 80;
      if (visible) {
        const delay = el.getAttribute('data-delay') || 0;
        setTimeout(() => el.classList.add('aos-visible'), parseInt(delay));
      }
    });
  }
  // Initial trigger
  setTimeout(revealOnScroll, 100);

  /* ─── COUNTER ANIMATION ─── */
  let counterTriggered = false;

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const step = 30;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current);
    }, step);
  }

  function handleCounter() {
    if (counterTriggered) return;
    const statsSection = document.querySelector('.stats-grid');
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      counterTriggered = true;
      document.querySelectorAll('.counter').forEach(animateCounter);
    }
  }

  /* ─── ACHIEVEMENT SLIDER PAUSE ON HOVER (CSS handles animation) ─── */
  // The CSS animation handles infinite scroll; JS adds pause on hover class
  const sliderTrack = document.getElementById('sliderTrack');
  if (sliderTrack) {
    // Touch swipe support for slider
    let startX = 0;
    sliderTrack.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      sliderTrack.style.animationPlayState = 'paused';
    }, { passive: true });
    sliderTrack.addEventListener('touchend', () => {
      sliderTrack.style.animationPlayState = 'running';
    }, { passive: true });
  }

  /* ─── BACK TO TOP BUTTON ─── */
  const bttBtn = document.getElementById('backToTop');

  function handleBackToTop() {
    if (window.scrollY > 400) {
      bttBtn.classList.add('visible');
    } else {
      bttBtn.classList.remove('visible');
    }
  }

  if (bttBtn) {
    bttBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ─── WHY CARDS HOVER GLOW EFFECT ─── */
  document.querySelectorAll('.why-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', x + 'px');
      card.style.setProperty('--my', y + 'px');
    });
  });

  /* ─── PROGRAM CARD TILT EFFECT ─── */
  document.querySelectorAll('.prog-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      const tiltX = dy * 6;
      const tiltY = -dx * 6;
      card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.35s, border-color 0.35s';
    });
  });

  /* ─── STAT BOX NUMBER FORMAT ─── */
  // Already handled by counter

  /* ─── NAVBAR HEIGHT CSS VAR ─── */
  function setNavHeight() {
    document.documentElement.style.setProperty('--nav-h', navbar.offsetHeight + 'px');
  }
  setNavHeight();
  window.addEventListener('resize', setNavHeight, { passive: true });

  /* ─── INTERSECTION OBSERVER FALLBACK FOR AOS ─── */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.getAttribute('data-delay') || 0);
          setTimeout(() => el.classList.add('aos-visible'), delay);
          observer.unobserve(el);
        }
      });
    }, { rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
  }

  /* ─── TYPING EFFECT ON HERO (optional flair) ─── */
  const htLine = document.querySelector('.ht-line');
  if (htLine) {
    // Already animated via CSS; add a subtle text shimmer class
    setTimeout(() => htLine.classList.add('shimmer-ready'), 1500);
  }

  /* ─── FACILITY ITEMS STAGGER ANIMATION ─── */
  const facItems = document.querySelectorAll('.fac-item');
  const facObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }, idx * 80);
        facObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  facItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    facObserver.observe(item);
  });

  /* ─── TESTIMONIAL CARDS STAGGER ─── */
  const testiCards = document.querySelectorAll('.testi-card');
  const testiObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, idx * 120);
        testiObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  testiCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    testiObserver.observe(card);
  });

  /* ─── ACHIEVEMENT CARD STAGGER IN SLIDER ─── */
  // Slider is CSS animated; individual cards get hover effects via CSS

  /* ─── RESIZE HANDLER ─── */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Close mobile menu on resize to tablet/desktop
      if (window.innerWidth > 768) {
        hamburger.classList.remove('open');
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    }, 200);
  }, { passive: true });

  /* ─── CURSOR GLOW (desktop only, optional) ─── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(232,130,12,0.04) 0%, transparent 70%);
      pointer-events: none;
      z-index: 0;
      transform: translate(-50%, -50%);
      transition: left 0.08s linear, top 0.08s linear;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    }, { passive: true });
  }

  console.log('%c🧠 Brain Stormers Academic & Admission Care', 'color:#E8820C;font-size:16px;font-weight:bold;font-family:serif;');
  console.log('%c✨ Website crafted with precision & care.', 'color:#1A2B52;font-size:12px;');
});
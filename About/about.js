document.addEventListener("DOMContentLoaded", function () {
  /* ─── NAVBAR SCROLL ─── */
  const navbar = document.getElementById("navbar");
  
  function updateNavbar() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  /* ─── HAMBURGER MENU ─── */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navMenu.classList.toggle("open");
    
    // Toggle body scroll
    if (navMenu.classList.contains("open")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Close menu on link click
  navMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navMenu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* ─── MODAL LOGIC ─── */
  const modalOverlay = document.getElementById("modalOverlay");
  const moreInfoBtn = document.getElementById("moreInfoBtn");
  const modalClose = document.getElementById("modalClose");

  function openModal() {
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (moreInfoBtn) {
    moreInfoBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openModal();
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeModal);
  }

  // Close modal on outside click
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // Close on ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });

  /* ─── CUSTOM AOS (Animate On Scroll) ─── */
  function revealOnScroll() {
    const elements = document.querySelectorAll("[data-aos]");
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 80;
      if (isVisible) {
        const delay = el.getAttribute("data-delay") || 0;
        setTimeout(() => {
          el.classList.add("aos-visible");
        }, parseInt(delay));
      }
    });
  }

  // Initial trigger and scroll hook
  window.addEventListener("scroll", revealOnScroll, { passive: true });
  revealOnScroll();

  /* ─── RESIZE HANDLER ─── */
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      hamburger.classList.remove("open");
      navMenu.classList.remove("open");
      document.body.style.overflow = "";
    }
  }, { passive: true });

  /* ─── ACCENTUATE THE DESIGN ─── */
  console.log("%c🧠 Brain Stormers | About Page Active", "color: #E8820C; font-weight: bold; font-size: 14px;");
});

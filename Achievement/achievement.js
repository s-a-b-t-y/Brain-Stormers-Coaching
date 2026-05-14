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



  /* ─── GALLERY MODAL LOGIC ─── */
  const viewMoreBtn = document.getElementById('viewMoreBtn');
  const galleryModal = document.getElementById('galleryModal');
  const closeModal = document.getElementById('closeModal');
  const modalOverlay = document.querySelector('.modal-overlay');

  function openModal() {
    galleryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeGallery() {
    galleryModal.classList.remove('active');
    // Only restore scroll if hamburger menu is NOT open
    if (!navMenu.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }

  if (viewMoreBtn) viewMoreBtn.addEventListener('click', openModal);
  if (closeModal) closeModal.addEventListener('click', closeGallery);
  if (modalOverlay) modalOverlay.addEventListener('click', closeGallery);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && galleryModal.classList.contains('active')) {
      closeGallery();
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

  /* ─── SHUFFLE ACHIEVEMENTS ─── */
  const achievementImages = [
    "1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg", "10.jpg",
    "11.jpg", "12.jpg", "13.jpg", "14.jpg", "15.jpg", "16.jpg", "17.jpg", "18.jpg", "19.jpg", "20.jpg",
    "21.jpg", "22.jpg", "23.jpg", "24.jpg", "25.jpg", "26.jpg", "27.jpg", "28.jpg", "29.jpg", "30.jpg",
    "medical.jpg"
  ];

  function shuffleAchievements() {
    const grid = document.querySelector('.ach-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.ach-card img');
    if (cards.length === 0) return;

    const shuffled = [...achievementImages].sort(() => 0.5 - Math.random());
    
    cards.forEach((img, index) => {
      if (shuffled[index]) {
        img.src = `../Library/achievement-album/${shuffled[index]}`;
        img.alt = `Achievement ${shuffled[index].replace('.jpg', '')}`;
      }
    });
  }

  shuffleAchievements();

  console.log("%c🧠 Brain Stormers | Achievement Page Active", "color: #E8820C; font-weight: bold; font-size: 14px;");
});

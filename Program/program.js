document.addEventListener("DOMContentLoaded", () => {
  // Navbar Scroll Effect
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
  });

  // Mobile Menu Toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navMenu.classList.toggle("open");
  });

  // AOS Animation logic
  const aosElements = document.querySelectorAll("[data-aos]");
  const aosObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-visible");
          aosObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );
  aosElements.forEach((el) => aosObserver.observe(el));
  
  // Poster Carousel Logic
  const cards = document.querySelectorAll('.poster-card');
  const indicators = document.querySelectorAll('.indicator');
  let currentIndex = 0;
  let carouselInterval;
  
  function updateCarousel(index) {
      cards.forEach((card, i) => {
          card.classList.remove('active', 'prev', 'next');
          indicators[i].classList.remove('active');
      });
      
      const activeCard = cards[index];
      const prevCard = cards[(index - 1 + cards.length) % cards.length];
      const nextCard = cards[(index + 1) % cards.length];
      
      activeCard.classList.add('active');
      prevCard.classList.add('prev');
      nextCard.classList.add('next');
      
      indicators[index].classList.add('active');
      currentIndex = index;
  }
  
  if(cards.length > 0) {
      // Initialize
      updateCarousel(currentIndex);
      
      // Auto-advance
      const startCarousel = () => {
          carouselInterval = setInterval(() => {
              updateCarousel((currentIndex + 1) % cards.length);
          }, 3500); // 3.5 seconds
      };
      
      startCarousel();
      
      // Pause on hover
      const carouselWrap = document.querySelector('.poster-carousel-wrap');
      carouselWrap.addEventListener('mouseenter', () => clearInterval(carouselInterval));
      carouselWrap.addEventListener('mouseleave', startCarousel);
      
      // Click indicators to navigate
      indicators.forEach((indicator, i) => {
          indicator.addEventListener('click', () => {
              updateCarousel(i);
              clearInterval(carouselInterval);
              startCarousel();
          });
      });
  }
  
  // Modal Logic
  const modalOverlay = document.getElementById('posterModalOverlay');
  const modalImg = document.getElementById('posterModalImg');
  const modalClose = document.getElementById('posterModalClose');
  
  cards.forEach(card => {
      card.addEventListener('click', (e) => {
          // If the image clicked is NOT the active one, make it active
          // Otherwise, open the modal
          if (!card.classList.contains('active')) {
            const index = Array.from(cards).indexOf(card);
            updateCarousel(index);
          } else {
            const imgSrc = card.getAttribute('data-img');
            modalImg.src = imgSrc;
            modalOverlay.classList.add('active');
          }
      });
  });
  
  if (modalClose) {
      modalClose.addEventListener('click', () => {
          modalOverlay.classList.remove('active');
      });
  }
  
  // Close on clicking outside
  if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
          if (e.target === modalOverlay) {
              modalOverlay.classList.remove('active');
          }
      });
  }

  // Hit escape to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains("active")) {
      modalOverlay.classList.remove("active");
    }
  });
});

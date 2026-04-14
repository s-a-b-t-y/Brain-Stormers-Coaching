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
  const carouselWrap = document.querySelector('.poster-carousel-wrap');
  const cardsContainer = document.getElementById('posterCards');
  let cards = Array.from(document.querySelectorAll('.poster-card'));
  const indicators = document.querySelectorAll('.indicator');
  let currentIndex = 0;
  let carouselInterval;
  
  // If we only have 3 cards, clone them to prevent the ugly 'sweep' delay across the back 
  if (cards.length === 3 && cardsContainer) {
      cards.forEach(card => {
          const clone = card.cloneNode(true);
          cardsContainer.appendChild(clone);
      });
      // Re-select all cards after cloning
      cards = Array.from(document.querySelectorAll('.poster-card'));
  }
  
  function updateCarousel(index) {
      cards.forEach((card) => {
          card.classList.remove('active', 'prev', 'next');
      });
      indicators.forEach(ind => ind.classList.remove('active'));
      
      const activeCard = cards[index];
      const prevCard = cards[(index - 1 + cards.length) % cards.length];
      const nextCard = cards[(index + 1) % cards.length];
      
      activeCard.classList.add('active');
      prevCard.classList.add('prev');
      nextCard.classList.add('next');
      
      const indIndex = index % indicators.length;
      if (indicators[indIndex]) indicators[indIndex].classList.add('active');
      currentIndex = index;
  }
  
  function startCarousel() {
      // Always clear the existing interval before setting a new one
      clearInterval(carouselInterval);
      carouselInterval = setInterval(() => {
          updateCarousel((currentIndex + 1) % cards.length);
      }, 3000); // Reduced to 3 seconds for faster rotation
  }
  
  if (cards.length > 0) {
      // Initialize
      updateCarousel(currentIndex);
      startCarousel();
      
      // Pause on hover
      if (carouselWrap) {
          carouselWrap.addEventListener('mouseenter', () => clearInterval(carouselInterval));
          carouselWrap.addEventListener('mouseleave', startCarousel);
      }
      
      // Click indicators to navigate
      indicators.forEach((indicator, i) => {
          indicator.addEventListener('click', () => {
              // Find the closest index in the cloned array that represents this indicator
              // Or simply just jump to the first matching index since they loop anyway
              updateCarousel(i);
              startCarousel(); // Reset timer
          });
      });
  }
  
  // Modal Logic
  const modalOverlay = document.getElementById('posterModalOverlay');
  const modalImg = document.getElementById('posterModalImg');
  const modalClose = document.getElementById('posterModalClose');
  
  // Re-attach card click listeners properly after potentially cloning
  cards.forEach(card => {
      card.addEventListener('click', (e) => {
          if (!card.classList.contains('active')) {
            const index = cards.indexOf(card);
            updateCarousel(index);
            startCarousel(); // Reset timer
          } else {
            const imgSrc = card.getAttribute('data-img');
            if (modalImg) modalImg.src = imgSrc;
            if (modalOverlay) modalOverlay.classList.add('active');
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

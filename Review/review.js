import { db } from "../Firebase/firestore.js";
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const reviewForm = document.getElementById("reviewForm");
const reviewsContainer = document.getElementById("reviewsContainer");
const starRating = document.getElementById("starRating");
const ratingInput = document.getElementById("rating");
const avgRatingValue = document.getElementById("avgRatingValue");
const avgRatingStars = document.getElementById("avgRatingStars");
const totalReviewsText = document.getElementById("totalReviewsText");

// --- STAR RATING LOGIC ---
const stars = starRating.querySelectorAll("i");
stars.forEach(star => {
  star.addEventListener("click", () => {
    const rating = star.getAttribute("data-rating");
    ratingInput.value = rating;
    updateStars(rating);
  });
});

function updateStars(rating) {
  stars.forEach(star => {
    if (parseInt(star.getAttribute("data-rating")) <= parseInt(rating)) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

// Initialize stars (default 5)
updateStars(5);

// --- FORM SUBMISSION ---
reviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const studentClass = document.getElementById("studentClass").value;
  const school = document.getElementById("school").value;
  const rating = ratingInput.value;
  const opinion = document.getElementById("opinion").value;

  const submitBtn = reviewForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Submitting...</span><i class="fas fa-spinner fa-spin"></i>';

  try {
    await addDoc(collection(db, "Student-Review"), {
      name,
      studentClass,
      school,
      rating: parseInt(rating),
      opinion,
      createdAt: serverTimestamp()
    });

    alert("Thank you for your review!");
    reviewForm.reset();
    updateStars(5);
    loadReviews(); // Reload reviews after submission
  } catch (error) {
    console.error("Error adding review: ", error);
    alert("Something went wrong. Please try again.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span>Submit Review</span><i class="fas fa-paper-plane"></i>';
  }
});

// --- LOAD REVIEWS ---
async function loadReviews() {
  reviewsContainer.innerHTML = '<div class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> Loading reviews...</div>';

  try {
    const q = query(collection(db, "Student-Review"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    reviewsContainer.innerHTML = ""; // Clear loader

    if (querySnapshot.empty) {
      reviewsContainer.innerHTML = '<div class="loading-spinner">No reviews yet. Be the first to write one!</div>';
      updateAverageRatingDisplay("0.0", 0);
      return;
    }

    let totalRating = 0;
    let count = 0;

    querySnapshot.forEach((doc, index) => {
      const data = doc.data();
      totalRating += data.rating || 0;
      count++;
      const card = createReviewCard(data, index);
      reviewsContainer.appendChild(card);
    });

    const average = count > 0 ? (totalRating / count).toFixed(1) : "0.0";
    updateAverageRatingDisplay(average, count);
  } catch (error) {
    console.error("Error getting reviews: ", error);
    reviewsContainer.innerHTML = '<div class="loading-spinner">Error loading reviews. Please refresh.</div>';
  }
}

function updateAverageRatingDisplay(average, total) {
  if (avgRatingValue) avgRatingValue.textContent = average;
  
  if (totalReviewsText) {
    totalReviewsText.textContent = total > 0 
      ? `Over ${total}+ students have shared their journey with us. Be the next one!`
      : "Be the first student to share your journey with us!";
  }

  if (avgRatingStars) {
    let starsHtml = "";
    const fullStars = Math.floor(average);
    const hasHalfStar = average % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        starsHtml += '<i class="fas fa-star"></i>';
      } else if (i === fullStars + 1 && hasHalfStar) {
        starsHtml += '<i class="fas fa-star-half-stroke"></i>';
      } else {
        starsHtml += '<i class="far fa-star"></i>';
      }
    }
    avgRatingStars.innerHTML = starsHtml;
  }
}

function createReviewCard(data, index) {
  const card = document.createElement("div");
  card.className = "review-card";
  card.setAttribute("data-aos", "fade-up");
  card.setAttribute("data-aos-delay", (index % 3) * 100);

  const date = data.createdAt ? data.createdAt.toDate().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "Just now";
  
  let starsHtml = "";
  for (let i = 1; i <= 5; i++) {
    starsHtml += `<i class="${i <= data.rating ? 'fas' : 'far'} fa-star"></i>`;
  }

  card.innerHTML = `
    <div class="rc-header">
      <div class="rc-stars">${starsHtml}</div>
      <div class="rc-date">${date}</div>
    </div>
    <div class="rc-body">
      "${data.opinion}"
    </div>
    <div class="rc-footer">
      <div class="rc-avatar">${data.name.charAt(0).toUpperCase()}</div>
      <div class="rc-info">
        <h4>${data.name}</h4>
        <span>${data.studentClass} | ${data.school}</span>
      </div>
    </div>
  `;
  return card;
}

// Initial load
loadReviews();

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
      return;
    }

    querySnapshot.forEach((doc, index) => {
      const data = doc.data();
      const card = createReviewCard(data, index);
      reviewsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error getting reviews: ", error);
    reviewsContainer.innerHTML = '<div class="loading-spinner">Error loading reviews. Please refresh.</div>';
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

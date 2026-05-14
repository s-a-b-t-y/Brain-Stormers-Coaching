import { db } from "./Firebase/firestore.js";
import { 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit 
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

const homeReviewsContainer = document.getElementById("homeReviewsContainer");

async function loadHomeReviews() {
  if (!homeReviewsContainer) return;

  try {
    // Fetch a larger set to allow for meaningful shuffling
    const q = query(
      collection(db, "Student-Review"), 
      orderBy("rating", "desc"),
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    
    homeReviewsContainer.innerHTML = "";

    if (querySnapshot.empty) {
      homeReviewsContainer.innerHTML = '<div class="loading-spinner">No reviews yet.</div>';
      return;
    }

    let allReviews = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Filter for 4 and 5 star reviews
      if (data.rating >= 4) {
        allReviews.push(data);
      }
    });

    // Shuffle reviews
    const shuffled = allReviews.sort(() => 0.5 - Math.random());
    
    // Display top 6 (or fewer if not enough)
    const toDisplay = shuffled.slice(0, 6);

    if (toDisplay.length === 0) {
      homeReviewsContainer.innerHTML = '<div class="loading-spinner">No high-rated reviews yet.</div>';
      return;
    }

    toDisplay.forEach((data) => {
      const card = createReviewCard(data);
      homeReviewsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading home reviews: ", error);
    homeReviewsContainer.innerHTML = '<div class="loading-spinner">Error loading reviews.</div>';
  }
}


function createReviewCard(data) {
  const card = document.createElement("div");
  card.className = "review-card";
  card.setAttribute("data-aos", "fade-up");

  let starsHtml = "";
  for (let i = 1; i <= 5; i++) {
    starsHtml += `<i class="${i <= data.rating ? 'fas' : 'far'} fa-star"></i>`;
  }

  card.innerHTML = `
    <div class="rc-header">
      <div class="rc-stars">${starsHtml}</div>
    </div>
    <div class="rc-body">
      "${data.opinion}"
    </div>
    <div class="rc-footer">
      <div class="rc-avatar">${data.name.charAt(0).toUpperCase()}</div>
      <div class="rc-info">
        <h4>${data.name}</h4>
        <span>${data.studentClass}</span>
      </div>
    </div>
  `;
  return card;
}

document.addEventListener("DOMContentLoaded", loadHomeReviews);

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
    const q = query(
      collection(db, "Student-Review"), 
      orderBy("createdAt", "desc"), 
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    
    homeReviewsContainer.innerHTML = "";

    if (querySnapshot.empty) {
      homeReviewsContainer.innerHTML = '<div class="loading-spinner">No reviews yet.</div>';
      return;
    }

    querySnapshot.forEach((doc) => {
      const data = doc.data();
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

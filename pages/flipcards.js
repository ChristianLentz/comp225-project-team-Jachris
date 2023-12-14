/**
 * This file has scripts for displaying posts on both the home page 
 * and user account page. 
 */

document.addEventListener("DOMContentLoaded", function () {
  const postGrid = document.querySelector(".postGrid");
  const postArea = document.querySelector(".postGrid");
  let enlargedCard = null;

  if (postGrid && postArea) {
    postGrid.addEventListener("click", function (e) {
      const clickedCard = e.target.closest(".flipdiv.v");

      const isTrashButtonClick = e.target.classList.contains("trashButton");

      if (clickedCard && !isTrashButtonClick) {
        if (enlargedCard === clickedCard) {
          // If the clicked card is already enlarged, revert it to the original size
          clickedCard.style.width = "180px";
          clickedCard.style.height = "160px";
          toggleFlip(clickedCard);
          clickedCard.classList.remove("enlarged-card"); // Remove the custom class
          enlargedCard = null;
          postArea.classList.remove("enlarged");
        } else {
          // Revert the previously enlarged card (if any)
          if (enlargedCard) {
            enlargedCard.style.width = "180px";
            enlargedCard.style.height = "160px";
            toggleFlip(enlargedCard);
            enlargedCard.classList.remove("enlarged-card"); // Remove the custom class
          }

          // Enlarge the clicked card
          postArea.classList.add("enlarged");
          clickedCard.style.width = "222px"; // Adjust the width as needed
          clickedCard.style.height = "160px"; // Adjust the height as needed
          toggleFlip(clickedCard);
          clickedCard.classList.add("enlarged-card"); // Add the custom class
          enlargedCard = clickedCard;
        }
      }
    });
  }
});

// Function to bring the clicked card to the front
function bringCardToFront(card) {
  const cards = document.querySelectorAll(".flipdiv.v");
  cards.forEach((cardElement) => {
    cardElement.style.zIndex = "auto"; // Reset z-index for all cards
  });
  card.style.zIndex = "1"; // Set the z-index of the clicked card to be above the others
}

// Function to toggle the flip effect on a card
function toggleFlip(card) {
  if (/\bshowBack\b/.test(card.className)) {
    card.className = card.className.replace(/ ?\bshowBack\b/g, "");
  } else {
    card.className += " showBack";
  }
}

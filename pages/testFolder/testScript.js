

// document.addEventListener("DOMContentLoaded", function () {
//   // Add a click event listener to the common ancestor "postGrid" using event delegation
//   const postGrid = document.querySelector(".postGrid");
//   if (postGrid) {
//       postGrid.addEventListener("click", function (e) {
//           const clickedCard = e.target.closest(".flipdiv.v");
//           if (clickedCard) {
//               bringCardToFront(clickedCard);
//               toggleFlip(clickedCard);
//           }
//       });
//   }
// });

// // Function to bring the clicked card to the front
// function bringCardToFront(card) {
//   // Get the maximum z-index among all cards
//   const cards = document.querySelectorAll(".flipdiv.v");
//   let maxZIndex = 0;
//   cards.forEach((cardElement) => {
//       const zIndex = parseInt(window.getComputedStyle(cardElement).zIndex);
//       if (!isNaN(zIndex) && zIndex > maxZIndex) {
//           maxZIndex = zIndex;
//       }
//   });

//   // Set the z-index of the clicked card to be above the maximum
//   card.style.zIndex = maxZIndex + 1;
// }

// // Function to toggle the flip effect on a card
// function toggleFlip(card) {
//   if (/\bshowBack\b/.test(card.className)) {
//       card.className = card.className.replace(/ ?\bshowBack\b/g, "");
//   } else {
//       card.className += " showBack";
//   }
// }
document.addEventListener("DOMContentLoaded", function () {
  const postGrid = document.querySelector(".postGrid");
  const postArea = document.querySelector(".postArea");

  if (postGrid && postArea) {
    postGrid.addEventListener("click", function (e) {
      const clickedCard = e.target.closest(".flipdiv.v");
      if (clickedCard) {
        if (postArea.classList.contains("enlarged")) {
          postArea.classList.remove("enlarged");
          clickedCard.style.transform = "scale(1)";
        } else {
          postArea.classList.add("enlarged");
          clickedCard.style.transform = "scale(1.2)";
          bringCardToFront(clickedCard);
        }
        toggleFlip(clickedCard);
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

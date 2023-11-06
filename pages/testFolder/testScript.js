

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
// document.addEventListener("DOMContentLoaded", function () {
//   const postGrid = document.querySelector(".postGrid");
//   const postArea = document.querySelector(".postArea");

//   if (postGrid && postArea) {
//     postGrid.addEventListener("click", function (e) {
//       const clickedCard = e.target.closest(".flipdiv.v");
//       if (clickedCard) {
//         if (postArea.classList.contains("enlarged")) {
//           postArea.classList.remove("enlarged");
//           clickedCard.style.transform = "scale(1)";
//          } else {
         
//         //   postArea.classList.add("enlarged");
//         //   clickedCard.style.transform = "scale(1.2)";
//         //   // const translateX = `calc(-${column} * (100% + 20px))`;
//         //   // clickedCard.style.transform = `scale(1.2) translateX(${translateX})`;
//         //   bringCardToFront(clickedCard);
//         }
//         toggleFlip(clickedCard);
//       }
//     });
//   }
// });


document.addEventListener("DOMContentLoaded", function () {
  const postGrid = document.querySelector(".postGrid");
  const postArea = document.querySelector(".postArea");
  let enlargedCard = null;

  if (postGrid && postArea) {
    postGrid.addEventListener("click", function (e) {
      const clickedCard = e.target.closest(".flipdiv.v");
      if(!clickedCard) {
        enlargedCard.style.zIndex = "0";
      }
      if (clickedCard) {
        if (enlargedCard === clickedCard) {
          // If the clicked card is already enlarged, revert it to the original size
          clickedCard.style.width = "180px";
          clickedCard.style.height = "160px";
          // clickedCard.style.transform = "scale(1)";
          console.log("im clicked")
          toggleFlip(clickedCard);
          clickedCard.style.zIndex = "0";
          enlargedCard = null;
          // enlargedCard.style.zIndex = "0";
          postArea.classList.remove("enlarged");
        } else {
          // Revert the previously enlarged card (if any)
          // if (enlargedCard) {
          //   console.log("unclicked")
          //   enlargedCard.style.zIndex = "0"; // Reset the z-index for the previously enlarged card
          //   toggleFlip(enlargedCard);
          // }

          // Enlarge the clicked card
          postArea.classList.add("enlarged");
          clickedCard.style.width = "222px"; // Adjust the width as needed
          clickedCard.style.height = "160px"; // Adjust the height as needed
          clickedCard.style.zIndex = "1"; // Set the z-index to bring it to the front
          toggleFlip(clickedCard);
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

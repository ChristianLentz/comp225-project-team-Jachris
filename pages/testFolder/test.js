// // document.addEventListener("DOMContentLoaded", function() {
// //     // Add event listener for the createCardButton
// //     const createCardButton = document.getElementById('createCardButton');

//     // createCardButton.addEventListener('click', function() {
//     //     let url = new URL(window.location.href);

//     //     console.log('Current URL:', window.location.href);
//     //     console.log('Pathname:', url.pathname);

//     //     if (url.pathname.endsWith('/pages/testFolder/testpost.html')) {
//     //         url.searchParams.set('createCard', 'true');
//     //         window.history.pushState({}, '', url);

//     //         let newIndexURL = new URL('index.html', window.location.origin);
//     //         newIndexURL.searchParams.set('createCard', 'true');
//     //         window.location.href = newIndexURL.href;
//     //     } else {
//     //         console.log("URL doesn't match the condition");
//     //     }
//     // });

//     // const urlParams = new URLSearchParams(window.location.search);
//     // if (urlParams.get('createCard') === 'true') {
//     //     // Call the createCard function when the parameter is present
//     //     console.log("true");
//     //     createCard();
//         // Your logic to create a card here

//         document.addEventListener("DOMContentLoaded", function() {
//             const createCardButton = document.getElementById('createCardButton');
        
//             createCardButton.addEventListener('click', function() {
//                 let url = new URL(window.location.href);
                
//                 console.log('Current URL:', window.location.href);
//                 console.log('Pathname:', url.pathname);
        
//                 if (url.pathname.endsWith('/pages/testFolder/testpost.html')) {
//                     url.searchParams.set('createCard', 'true');
        
//                     // Update the URL without redirecting
//                     window.history.pushState({}, '', url);
                    
//                     console.log('URL updated without redirection:', window.location.href);
//                 } else {
//                     console.log("URL doesn't match the condition");
//                 }
//             });
        
//             const urlParams = new URLSearchParams(window.location.search);
//             if (urlParams.get('createCard') === 'true') {
//                 console.log("true");
//                 createCard();
//                 // Your logic to create a card here
//             }
//         });
        

// function createCard() {
        

//             // Create the card container element

 

//   const card = document.createElement('div');
//   card.classList.add('flipdiv', 'v'); // Add the 'flipdiv' and 'v' classes

//   card.addEventListener('click', flipdivClicked);

//   // ...

//   // Create the front side of the card
//   const front = document.createElement('div');
//   front.classList.add('front', 'card-side'); // Add the 'front' and 'card-side' classes

//   // ...

//   // Create the back side of the card
//   const back = document.createElement('div');
//   back.classList.add('back', 'card-side'); // Add the 'back' and 'card-side' classes

//   // Apply your CSS classes to specific elements
//   const frontText = document.createElement('div');
//   frontText.classList.add('frontText'); // Add the 'frontText' class
//   frontText.textContent = 'Here is my image';

//   const frontPrice = document.createElement('div');
//   frontPrice.classList.add('frontPrice'); // Add the 'frontPrice' class
//   frontPrice.textContent = '$10';

//   const frontImage = document.createElement('div');
//   frontImage.classList.add('frontImage'); // Add the 'frontImage' class
//   const frontImageImg = document.createElement('img');
//   frontImageImg.src = '/images/macLogo.png';
//   frontImageImg.alt = 'mac logo 1';
//   frontImage.appendChild(frontImageImg);

//   const backImage = document.createElement('div');
//   backImage.classList.add('backImage'); // Add the 'backImage' class
//   const backImageImg = document.createElement('img');
//   backImageImg.src = '/images/macLogo.png';
//   backImageImg.alt = 'mac logo 2';
//   backImage.appendChild(backImageImg);

//   const backTitle = document.createElement('div');
//   backTitle.classList.add('backTitle'); // Add the 'backTitle' class
//   backTitle.textContent = 'Here is my image';

//   const backDescription = document.createElement('div');
//   backDescription.classList.add('backDescription'); // Add the 'backDescription' class
//   backDescription.textContent = 'Here is the description of the back of my photo it is a very cool photo that I like very much and it is awesome.';

//   const price = document.createElement('div');
//   price.classList.add('price'); // Add the 'price' class
//   price.textContent = '$10';

//   const sellerInfo = document.createElement('div');
//   sellerInfo.classList.add('sellerInfo'); // Add the 'sellerInfo' class
//   sellerInfo.textContent = 'Seller: Jacob';

//   // Append elements to the front and back sides
//   front.appendChild(frontImage);
//   front.appendChild(frontText);
//   front.appendChild(frontPrice);

//   back.appendChild(backImage);
//   back.appendChild(backTitle);
//   back.appendChild(backDescription);
//   back.appendChild(price);
//   back.appendChild(sellerInfo);

//   // Append front and back sides to the card
//   card.appendChild(front);
//   card.appendChild(back);

//   card.style.marginBottom = '200px';

//   // Append the card to the document (or a specific container)
//   document.body.appendChild(card);
//         }
    

//     function flipdivClicked() {
//         // /onload = function(){
//         //     document.querySelector(".flipdiv.v").onclick = flipdivClicked;
//         //   };
//         //   function flipdivClicked(e) {
//             if (/\bshowBack\b/.test(this.className)) {
//               this.className = this.className.replace(/ ?\bshowBack\b/g, "");
//             }
//             else {
//               this.className += " showBack";
//             //}
//           }
//         }

//     // Other functions or event listeners can be added here.


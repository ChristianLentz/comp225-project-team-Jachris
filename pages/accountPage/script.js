// // // let user decide between mutiple photos 

document.getElementById('editBtn').addEventListener('click', openModal);

function openModal() {
  document.getElementById('editModal').style.display = 'block';
  // Populate form fields with current card content
  document.getElementById('username').value = document.getElementById('cardName').innerText;
  document.getElementById('descrip').value = document.getElementById('title').innerText;

  // // Get the current profile image source from the card and set it as the selected option
  // var currentImageSrc = document.getElementById('cardImage').getAttribute('src');
  // document.getElementById('profilePhoto').value = currentImageSrc;

  // Get the current profile image source from the card and set it as the checked option
  var currentImageSrc = document.getElementById('cardImage').getAttribute('src');
  document.querySelector(`input[name="profilePhoto"][value="${currentImageSrc}"]`).checked = true;
}

function closeModal() {
  document.getElementById('editModal').style.display = 'none';
}

document.getElementById('editForm').addEventListener('submit', function(event) {
  event.preventDefault();
  // Update card content with form data
  document.getElementById('cardName').innerText = document.getElementById('username').value;
  document.getElementById('title').innerText = document.getElementById('descrip').value;
  // document.getElementById('cardImage').setAttribute('src', document.getElementById('profilePhoto').value);
  // Get the selected image value
  var selectedImage = document.querySelector('input[name="profilePhoto"]:checked').value;
  // Update the card image source
  document.getElementById('cardImage').setAttribute('src', selectedImage);
  closeModal();
});

// document.getElementById('editBtn').addEventListener('click', openModal);

// function openModal() {
//     document.getElementById('editModal').style.display = 'block';
// }

// function closeModal() {
//     document.getElementById('editModal').style.display = 'none';
// }

// document.getElementById('editForm').addEventListener('submit', function(event) {
//     event.preventDefault();

//     // Add logic to handle form submission, update user profile, and close modal
//     // For simplicity, we're just logging the form data to the console
//     console.log('Username: ', document.getElementById('username').value);
//     console.log('Profile Picture URL: ', document.getElementById('profilePic').value);

//     closeModal();
// });

document.getElementById('editBtn').addEventListener('click', openModal);

function openModal() {
    document.getElementById('editModal').style.display = 'block';

    // Populate form fields with current card content
    document.getElementById('username').value = document.getElementById('cardName').innerText;
    //document.getElementById('profilePic').value = document.getElementById('cardImage').getAttribute('src');
}

function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

document.getElementById('editForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Update card content with form data
    document.getElementById('cardName').innerText = document.getElementById('username').value;
    //document.getElementById('cardImage').setAttribute('src', document.getElementById('profilePic').value);

    closeModal();
});


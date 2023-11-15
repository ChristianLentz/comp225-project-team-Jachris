    // Function to handle image selection
    function selectImage(element) {
      // Remove the 'selected' class from all image items
      const imageItems = document.querySelectorAll('.image-item');
      imageItems.forEach(item => item.classList.remove('selected'));

      // Add the 'selected' class to the clicked image item
      element.classList.add('selected');

      // You can retrieve the selected image path using:
      const selectedImagePath = element.querySelector('img').src;
      console.log('Selected Image Path:', selectedImagePath);
  }
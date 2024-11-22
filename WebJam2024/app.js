const photoFileInput = document.getElementById('file-input')
const photoBank = document.getElementById('photo-bank')

photoFileInput.addEventListener('change', handlePhotoFiles)

function handlePhotoFiles() {
    const files = photoFileInput.files;

    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const img = document.createElement('img');
                img.src = reader.result;
                photoBank.appendChild(img);
            };
        } else {
            alert(`${file.name} is not an image file.`);
        }
    }
}

// Array of image paths
const images = [
    "./images/photostrip_double.png",
    "./images/photostrip_horiz.png",
    "./images/photostrip_horiz2.png",
    "./images/photostrip_horiz3.png",
    "./images/photostrip_single.png",
    "./images/photostrip_single2.png",
    "./images/photostrip_vert.png"
];
  
  let currentIndex = 0;
  
  // Elements
  const sliderImage = document.getElementById('sliderImage');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  // Update the image in the slider
  function updateImage() {
    sliderImage.src = images[currentIndex];
  }
  
  // Event Listeners
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === 0) ? images.length - 1 : currentIndex - 1;
    updateImage();
  });
  
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex === images.length - 1) ? 0 : currentIndex + 1;
    updateImage();
  });
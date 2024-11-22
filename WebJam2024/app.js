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
                img.setAttribute("draggable", true);
                img.addEventListener("dragstart", handleDragStart)
                photoBank.appendChild(img);
            };
        } else {
            alert(`${file.name} is not an image file.`);
        }
    }
}

// Dragging images from the photobank out

function handleDragStart(event) {
    // Store the dragged image's source in the data transfer object
    event.dataTransfer.setData('text/plain', event.target.src);
}

const dropZones = document.querySelectorAll('.drop-zone');

dropZones.forEach(zone => {
    zone.addEventListener('dragover', (event) => {
        event.preventDefault(); // Necessary to allow drop
        event.currentTarget.classList.add('over'); // Highlight the drop zone
    });

    zone.addEventListener('dragleave', (event) => {
        event.currentTarget.classList.remove('over'); // Remove highlight
    });

    // Drop event listener
    zone.addEventListener('drop', (event) => {
        event.preventDefault();
        event.currentTarget.classList.remove('over');

        // Get the dropped image source and ID
        const imageSrc = event.dataTransfer.getData('text/plain');
        const imageId = event.dataTransfer.getData('image-id');

        // Fill the drop zone with the image
        const img = document.createElement('img');
        img.src = imageSrc;
        img.setAttribute('data-id', imageId);

        // Clear any existing content in the drop zone
        event.currentTarget.innerHTML = '';
        event.currentTarget.appendChild(img);
    });
});

// Array of image paths
const images = [
    { src: "./images/photostrip_double.png", type: "double" },
    { src: "./images/photostrip_horiz.png", type: "horiz" },
    { src: "./images/photostrip_horiz2.png", type: "horiz2" },
    { src: "./images/photostrip_horiz3.png", type: "horiz3" },
    { src: "./images/photostrip_single.png", type: "single" },
    { src: "./images/photostrip_single2.png", type: "single2" }, 
    { src: "./images/photostrip_vert.png", type: "vert" }
];
  
let currentIndex = 0;

// Elements
const sliderImage = document.getElementById('sliderImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const saveBtn = document.getElementById('saveBtn');
const savedPhotostripsContainer = document.getElementById('savedPhotostripsContainer');
const downloadAllBtn = document.getElementById('downloadAllBtn')

// Update the image in the slider
function updateImage() {
    sliderImage.src = images[currentIndex].src;
    sliderImage.setAttribute("data-type", type);
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

saveBtn.addEventListener('click', savePhotostrip);

function savePhotostrip() {
    const currentSrc = sliderImage.src;

    const photostripDiv = document.createElement('div');
    photostripDiv.classList.add('relative', 'bg-white', 'p-2', 'rounded', 'shadow-md', 'flex', 'items-center', 'justify-center');
    
    const photostripImg = document.createElement('img');
    photostripImg.src = currentSrc;
    photostripImg.alt = 'Saved Photostrip';
    photostripImg.classList.add('w-full', 'h-auto', 'rounded');

    photostripDiv.appendChild(photostripImg);
    savedPhotostripsContainer.appendChild(photostripDiv);
}

downloadAllBtn.addEventListener('click', () => {
    const photostripImages = savedPhotostripsContainer.querySelectorAll('img');
    if (photostripImages.length === 0) {
        alert('No photostrips to download.');
        return;
    }

    const zip = new JSZip();
    const folder = zip.folder("Photostrips");

    photostripImages.forEach((img, index) => {
        const imgSrc = img.src;
        fetch(imgSrc)
            .then(response => response.blob())
            .then(blob => {
                folder.file(`photostrip_${index + 1}.png`, blob);
                if (index === photostripImages.length - 1) {
                    zip.generateAsync({ type: "blob" }).then(content => {
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(content);
                        a.download = 'Photostrips.zip';
                        a.click();
                    });
                }
            });
    });
});
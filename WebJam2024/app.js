const fileInput = document.getElementById('file-input');
const photoBank = document.getElementById('photo-bank');
let currentFilter = 'none';

// Handle file input (photo upload)
fileInput.addEventListener('change', handleFiles);

const filters = document.querySelectorAll('.filter');
filters.forEach(filter => {
    filter.addEventListener('dragstart', (e) => {
        currentFilter = e.target.id;  // Store the currently dragged filter
    });
});

function handleFiles() {
    const files = fileInput.files;

    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const img = new Image();
                img.src = reader.result;

                img.onload = () => {
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('image-wrapper', 'p-4', 'rounded-lg', 'bg-white', 'shadow-md', 'drop-shadow-xl');
                    imgContainer.classList.add('droppable');

                    const imgElem = document.createElement('img');
                    imgElem.src = reader.result;
                    imgElem.classList.add('original-image', 'w-full', 'h-auto', 'rounded-lg');
                    

                    // Apply the current filter to the uploaded image directly
                    if (currentFilter !== 'none') {
                        applyImageFilter(imgElem, currentFilter);
                    }
                    imgContainer.appendChild(imgElem);
                    photoBank.appendChild(imgContainer);

                    // Add event listeners for drag-and-drop functionality
                    imgContainer.addEventListener('dragover', (e) => {
                        e.preventDefault();
                    });

                    imgContainer.addEventListener('drop', (e) => {
                        e.preventDefault();
                        applyImageFilter(imgElem, currentFilter); // Apply filter to the image when dropped
                    });
                };
            };
        } else {
            alert(`${file.name} is not an image file.`);
        }
    }
}
function applyImageFilter(imgElem, filterType) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size to match the image size
    canvas.width = imgElem.naturalWidth || imgElem.width;
    canvas.height = imgElem.naturalHeight || imgElem.height;

    // Apply the filter to the canvas
    ctx.filter = getFilterStyle(filterType);

    // Draw the image onto the canvas with the filter applied
    ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);

    // Get the filtered image data as a data URL
    const filteredImageDataUrl = canvas.toDataURL();

    // Update the original image element with the new filtered image
    imgElem.src = filteredImageDataUrl;
}

// Function to get the filter style for an image
function getFilterStyle(filterType) {
    switch (filterType) {
        case "grayscale":
            return 'grayscale(100%)';
        case "sepia":
            return 'sepia(100%)';
        case "invert":
            return 'invert(100%)';
        case "blur":
            return 'blur(5px)';
        case "polaroid":
            return 'contrast(90%) saturate(80%) brightness(110%)';
        case "brandywine":
            return 'sepia(100%) contrast(80%) brightness(110%)';
        default:
            return 'none'; // No filter
    }
}


// Dragging images from the photobank out

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.src);
}

const dropZones = document.querySelectorAll('.drop-zone');

dropZones.forEach(zone => {
    zone.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.currentTarget.classList.add('over');
    });

    zone.addEventListener('dragleave', (event) => {
        event.currentTarget.classList.remove('over'); 
    });

    zone.addEventListener('drop', (event) => {
        event.preventDefault();
        event.currentTarget.classList.remove('over');
        event.currentTarget.style.border = 'none';

        const imageSrc = event.dataTransfer.getData('text/plain');
        const imageId = event.dataTransfer.getData('image-id');

        // Create the image element and set the source
        const img = document.createElement('img');
        img.src = imageSrc;
        img.setAttribute('data-id', imageId);

        /*
        // Apply the filter to the dropped image (if any)
        if (currentFilter !== 'none') {
            applyImageFilter(img, currentFilter);
        }*/

        // Clear the drop zone and append the image
        event.currentTarget.innerHTML = '';
        event.currentTarget.appendChild(img);
    });
});


const saveBtn = document.getElementById('saveBtn');
const savedPhotostripsContainer = document.getElementById('savedPhotostripsContainer');
const downloadAllBtn = document.getElementById('downloadAllBtn');

// Save the combined photostrip with images from drop zones
saveBtn.addEventListener('click', saveScreenshot);
function saveScreenshot() {
    const photostripContainer = document.querySelector('.photo-strip'); // Select the container of the photostrip + drop zone images

    if (!photostripContainer) {
        alert('No photostrip to save!');
        return;
    }

    html2canvas(photostripContainer, {
        useCORS: true,
        scale: 2, // Increase the resolution of the canvas for better quality
        backgroundColor: null, // Maintain transparency if needed
        scrollX: window.scrollX, // Account for horizontal scrolling
        scrollY: window.scrollY, // Account for vertical scrolling
        width: photostripContainer.scrollWidth, // Full width of the container
        height: photostripContainer.scrollHeight, // Full height of the container
    }).then(canvas => {
        const imageDataUrl = canvas.toDataURL();

        // Display the saved combined photostrip
        const combinedImage = document.createElement('img');
        combinedImage.src = imageDataUrl;
        combinedImage.alt = 'Combined Photostrip';
        combinedImage.classList.add('w-auto', 'h-auto', 'rounded');

        // Add the photostrip to the saved photostrips container
        const photostripDiv = document.createElement('div');
        photostripDiv.classList.add('relative', 'bg-white', 'p-2', 'rounded', 'shadow-md', 'flex', 'items-center', 'justify-center');
        photostripDiv.appendChild(combinedImage);

        savedPhotostripsContainer.appendChild(photostripDiv);
    });
}

/*
function saveScreenshot() {
    const photostripContainer = document.querySelector('.photo-strip'); // Select the container of the photostrip + drop zone images

    if (!photostripContainer) {
        alert('No photostrip to save!');
        return;
    }

    // Ensure the images inside the container don't stretch (optional: set their max-width and height)
    const images = photostripContainer.querySelectorAll('img');
    images.forEach(img => {
        img.style.objectFit = 'contain';  // Ensures the images maintain their aspect ratio inside the container
    });

    
    html2canvas(photostripContainer, {
        useCORS: true, 
        scale: 1, 
        allowTaint: true, 
        backgroundColor: null, 
        logging: false, 
        x: window.scrollX, 
        y: window.scrollY, 
        width: photostripContainer.scrollWidth, 
        height: photostripContainer.scrollHeight, 
    }).then(canvas => {
        // Convert the canvas to a data URL (image)
        const imageDataUrl = canvas.toDataURL();

        // Create an image element to display the saved combined photostrip
        const combinedImage = document.createElement('img');
        combinedImage.src = imageDataUrl;
        combinedImage.alt = 'Combined Photostrip';
        combinedImage.classList.add('w-auto', 'h-auto', 'rounded'); 

        // Create a div to hold the new photostrip
        const photostripDiv = document.createElement('div');
        photostripDiv.classList.add('relative', 'bg-white', 'p-2', 'rounded', 'shadow-md', 'flex', 'items-center', 'justify-center');
        photostripDiv.appendChild(combinedImage);

        // Add the combined photostrip to the container
        savedPhotostripsContainer.appendChild(photostripDiv);
    });
}
*/
// Download all photostrips as a ZIP file
downloadAllBtn.addEventListener('click', () => {
    const photostripImages = savedPhotostripsContainer.querySelectorAll('img');
    if (photostripImages.length === 0) {
        alert('No photostrips to download.');
        return;
    }

    const zip = new JSZip();
    const folder = zip.folder('Photostrips');

    photostripImages.forEach((img, index) => {
        const imgSrc = img.src;
        fetch(imgSrc)
            .then(response => response.blob())
            .then(blob => {
                folder.file(`photostrip_${index + 1}.png`, blob);
                if (index === photostripImages.length - 1) {
                    zip.generateAsync({ type: 'blob' }).then(content => {
                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(content);
                        a.download = 'Photostrips.zip';
                        a.click();
                    });
                }
            });
    });
});



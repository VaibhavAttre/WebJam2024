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

// Handle image file upload and display
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
                    imgContainer.appendChild(imgElem);

                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    imgContainer.appendChild(canvas);
                    photoBank.appendChild(imgContainer);

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                        
                    imgContainer.addEventListener('dragover', (e) => {
                        e.preventDefault(); 
                    });

                    imgContainer.addEventListener('drop', (e) => {
                        e.preventDefault();
                        applyFilter(canvas, currentFilter); 
                    });
                };
            };
        } else {
            alert(`${file.name} is not an image file.`);
        }
    }
}

function applyPolaroidEffect(canvas) {
    Caman(canvas, function() {
        this.revert();
        //this.vintage();
        this.contrast(-10);
        this.saturation(-20);
        this.brightness(10);
        this.sharpen(0);
        this.noise(10);
        this.vignette(-20, -30);
        this.render();
    });
}

function applyBrandywineEffect(canvas) {

    // Get the canvas context
    const ctx = canvas.getContext('2d');

    // Create the Brandywine overlay image
    const brandywineOverlay = new Image();
    brandywineOverlay.src = 'filters/Untitled.png'; // Replace with the overlay image path

    brandywineOverlay.onload = () => {
        // Set the global alpha for transparency (optional)
        ctx.globalAlpha = 0.6; // Adjust transparency of overlay (0.0 to 1.0)

        // Draw the overlay image on top of the existing canvas content
        ctx.drawImage(brandywineOverlay, 0, 0, canvas.width, canvas.height);

        // Reset global alpha to default
        ctx.globalAlpha = 1.0;

        ctx.font = '36px Arial'; // Set font size and family
        ctx.fillStyle = 'white'; // Set text color (adjust as needed)
        ctx.textAlign = 'center'; // Center the text horizontally
        ctx.textBaseline = 'middle'; // Center the text vertically
        ctx.fillText("Brandywine", canvas.width / 2, canvas.height / 2); // Draw text at the center

        // Optional: Add shadow to make the text stand out
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 5;
    };
}

function applyFilter(canvas, filterType) {
    // Use CamanJS to apply the selected filter
    Caman(canvas, function() {
        if (filterType == "none") {
            this.revert();
        } else {
            this.revert(); // Revert any previous filters

            switch (filterType) {
                case "grayscale":
                    this.greyscale();
                    break;
                case "sepia":
                    this.sepia();
                    break;
                case "invert":
                    this.invert();
                    break;
                case "blur":
                    this.stackBlur(5); 
                    break;
                case "polaroid":
                    applyPolaroidEffect(canvas);
                    break;
                case "brandywine":
                    applyBrandywineEffect(canvas);
                    break;
                default:
                    break;
            }
        }   
        this.render();
    });
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

        const img = document.createElement('img');
        img.src = imageSrc;
        img.setAttribute('data-id', imageId);

        event.currentTarget.innerHTML = '';
        event.currentTarget.appendChild(img);
    });
});


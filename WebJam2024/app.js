

const fileInput = document.getElementById('file-input')
const photoBank = document.getElementById('photo-bank')
const filterChanger = document.getElementById("filter-changer");

fileInput.addEventListener('change', handleFiles)
let currentFilter = 'none';

const filters = document.querySelectorAll('.filter');
filters.forEach(filter => {
    filter.addEventListener('dragstart', (e) => {
        currentFilter = e.target.id; 
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
                    // Create the image container
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('image-wrapper');
                    imgContainer.classList.add('droppable'); // Make the image droppable

                    // Create an image element for display
                    const imgElem = document.createElement('img');
                    imgElem.src = reader.result;
                    imgElem.classList.add('original-image');
                    imgContainer.appendChild(imgElem);

                    // Create the canvas element for applying filters
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    imgContainer.appendChild(canvas);
                    photoBank.appendChild(imgContainer);

                    // Set up canvas context and draw the image
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    // Allow the user to drop a filter on the image
                    imgContainer.addEventListener('dragover', (e) => {
                        e.preventDefault(); // Necessary to allow drop
                    });

                    imgContainer.addEventListener('drop', (e) => {
                        e.preventDefault();
                        applyFilter(canvas, currentFilter); // Apply the current filter on drop
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
                    this.stackBlur(5); // Adjust blur amount as needed
                    break;
                case "polaroid":
                    applyPolaroidEffect(canvas);
                    break;
                default:
                    break;
            }
        }   
        this.render();
    });
}
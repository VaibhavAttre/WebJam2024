const fileInput = document.getElementById('file-input');
const photoBank = document.getElementById('photo-bank');
let currentFilter = 'none';

fileInput.addEventListener('change', handleFiles);

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
                    const imgContainer = document.createElement('div');
                    imgContainer.classList.add('image-wrapper');
                    imgContainer.classList.add('droppable');

                    const imgElem = document.createElement('img');
                    imgElem.src = reader.result;
                    imgElem.classList.add('original-image', 'w-auto', 'h-full', 'rounded-lg');

                    if (currentFilter !== 'none') {
                        applyImageFilter(imgElem, currentFilter);
                    }
                    imgContainer.appendChild(imgElem);
                    photoBank.appendChild(imgContainer);

                    imgContainer.addEventListener('dragover', (e) => {
                        e.preventDefault();
                    });

                    imgContainer.addEventListener('drop', (e) => {
                        e.preventDefault();
                        applyImageFilter(imgElem, currentFilter); 
                    });
                };
            };
        } else {
            alert(`${file.name} is not an image file.`);
        }
    }
}

function applyBrandywineEffect(canvas, imgElem) {
    const ctx = canvas.getContext('2d');

    canvas.width = imgElem.naturalWidth || imgElem.width;
    canvas.height = imgElem.naturalHeight || imgElem.height;
    ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);

    const brandywineOverlay = new Image();
    brandywineOverlay.src = 'filters/Untitled.png'; 

    brandywineOverlay.onload = () => {
        ctx.globalAlpha = 0.6; 

        ctx.drawImage(brandywineOverlay, 0, 0, canvas.width, canvas.height);

        ctx.globalAlpha = 1.0;

        ctx.font = '36px Arial'; 
        ctx.fillStyle = 'white'; 
        ctx.textAlign = 'center'; 
        ctx.textBaseline = 'middle'; 
        ctx.shadowColor = 'black'; 
        ctx.shadowBlur = 5;
        ctx.fillText("Brandywine", canvas.width / 2, canvas.height/2); 

        imgElem.src = canvas.toDataURL();
    };
}

function applyImageFilter(imgElem, filterType) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = imgElem.naturalWidth || imgElem.width;
    canvas.height = imgElem.naturalHeight || imgElem.height;

    if (filterType === "brandywine") {
        applyBrandywineEffect(canvas, imgElem);
    } else {
        ctx.filter = getFilterStyle(filterType);
        ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);
    }

    const filteredImageDataUrl = canvas.toDataURL();
    imgElem.src = filteredImageDataUrl;
}

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
            return 'brandywine';
        default:
            return 'none'; 
    }
}

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

const saveBtn = document.getElementById('saveBtn');
const savedPhotostripsContainer = document.getElementById('savedPhotostripsContainer');
const downloadAllBtn = document.getElementById('downloadAllBtn');

saveBtn.addEventListener('click', saveScreenshot);

function saveScreenshot() {
    const photostripContainer = document.querySelector('.photo-strip'); 

    if (!photostripContainer) {
        alert('No photostrip to save!');
        return;
    }

    html2canvas(photostripContainer, {
        useCORS: true,
        scale: 10, 
        backgroundColor: null,
        scrollX: window.scrollX,
        scrollY: window.scrollY, 
        width: photostripContainer.scrollWidth, 
        height: photostripContainer.scrollHeight, 
    }).then(canvas => {
        const imageDataUrl = canvas.toDataURL();

        const combinedImage = document.createElement('img');
        combinedImage.src = imageDataUrl;
        combinedImage.alt = 'Combined Photostrip';
        combinedImage.classList.add('w-auto', 'h-auto');

        const photostripDiv = document.createElement('div');
        photostripDiv.classList.add('relative', 'p-2');
        photostripDiv.appendChild(combinedImage);

        savedPhotostripsContainer.appendChild(photostripDiv);
    });
}

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



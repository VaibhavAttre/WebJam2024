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


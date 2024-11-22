const fileInput = document.getElementById('file-input')
const photoBank = document.getElementById('photo-bank')

fileInput.addEventListener('change', handleFiles)

function handleFiles() {
    const files = fileInput.files;

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
//hi
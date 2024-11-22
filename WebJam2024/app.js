const fileInput = document.getElementById('file-input')
const photoBank = document.getElementById('photo-bank')
const photo_bank_box = document.querySelector('#photo-bank .list')

fileInput.addEventListener('change', handleFiles)
photoBank.addEventListener('mousedown', dragDropFiles)

function handleFiles() {
    const files = fileInput.files;

    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const img = document.createElement('img')
                img.src = reader.result;
                img.draggable = "true"
                photo_bank_box.appendChild(img);
                if (photo_bank_box.children.length%4 == 0){
                    photoBank.style.minHeight+=100;
                    photo_bank_box.appendChild(img);
                } 

            };
        } else {
            alert(`${file.name} is not an image file.`);
        }
    }
}
function dragDropFiles() {
    let lists = document.getElementsByClassName("list")
    let rightBox = document.querySelectorAll('#drop-zone .list')
    let photoBox = document.querySelector('#photo-bank .list')

    for(list of lists){
        list.addEventListener("dragstart", function(e){
            let selected = e.target;
            
            rightBox.forEach(element => {
                element.addEventListener("dragover", function(e){
                    e.preventDefault();
                });
                element.addEventListener("drop", function(e){
                    if (element.children.length == 0){
                        element.appendChild(selected);
                    }
                    selected = null;
                });
        });
            photoBox.addEventListener("dragover", function(e){
                e.preventDefault();
            });
            photoBox.addEventListener("drop", function(e){
                photoBox.appendChild(selected);
                selected = null;
            });
        })
    }
}
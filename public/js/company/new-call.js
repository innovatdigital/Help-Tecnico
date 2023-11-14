let media = [];
let equipments = [];

const description = document.getElementById("description")
const uploadImagesInput = document.getElementById("media")
const selectedMedia = document.getElementById("selected-media")

function openEquipments() {
    const popup = document.getElementById("select-equipments")

    popup.classList.remove("hidden")
}

function closeEquipments() {
    const popup = document.getElementById("select-equipments")

    popup.classList.add("hidden")
}

function selectEquipment(id) {
    if (!equipments.includes(id)) {
        const selectBtn = document.getElementById(`equipment-select-${id}`).classList.add("hidden")
        const deselectBtn = document.getElementById(`equipment-deselect-${id}`).classList.remove("hidden")

        equipments.push(id)
    }
}

function deselectEquipment(id) {
    if (equipments.includes(id)) {
        const selectBtn = document.getElementById(`equipment-select-${id}`).classList.remove("hidden")
        const deselectBtn = document.getElementById(`equipment-deselect-${id}`).classList.add("hidden")

        const indexToRemove = equipments.findIndex(item => item == id);

        if (indexToRemove !== -1) {
            equipments.splice(indexToRemove, 1);
        }
    }
}

function uploadImages(e) {
    let files = e.target.files

    var chars = 'abcdefghijklmnopqrstuvwxyz';
    var id = '';

    for (var i = 0; i < chars.length; i++) {
        var random = Math.floor(Math.random() * chars.length);
        id += chars.charAt(random);
    }

    files[0].id = id

    const html = `
        <div id="${id}" class="p-6 mb-6 bg-white border border-coolGray-200 rounded-md">
            <div class="flex flex-wrap items-center justify-between">
                <p class="flex w-full sm:w-auto items-center">
                    <img src="${URL.createObjectURL(files[0])}" class="h-10 rounded-lg">
                    <span class="ml-2 text-coolGray-800 font-medium">${files[0].name}</span>
                </p>
                <button onclick="deleteImage('${id}')" class="text-coolGray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-blue-500">
                        <path fill-rule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clip-rule="evenodd" />
                    </svg>                  
                </button>
            </div>
        </div>
    `
    
    media.push(files[0])

    selectedMedia.insertAdjacentHTML("beforeend", html)

    files = []
}

function deleteImage(id) {
    const mediaRemove = document.getElementById(id);
    mediaRemove.remove()

    const indexToRemove = media.findIndex(item => item.id == id);

    if (indexToRemove !== -1) {
        media.splice(indexToRemove, 1);
    }
}

async function saveCall() {
    try {
        const saveMedia = [];

        if (description.value.length == 0) {
            alertMessage("error", "Você precisa descrever o problema")
            return
        }

        for (let i = 0; i < media.length; i++) {
            const formData = new FormData();
            formData.append('image', media[i]);

            const response = await fetch('/company/save-image-call', {
                method: 'POST',
                body: formData
            });

            if (response.status == 200) {
                const filename = await response.text();
                saveMedia.push(filename);
            }
        }

        const loading = document.getElementById("loading")
        loading.classList.remove("hidden")

        const response = await fetch("/company/save-call", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: description.value, photos: saveMedia, equipments: equipments })
        });

        if (response.status == 200) {
            const data = await response.json();

            location.href = `/company/view-call/${data._id}`;
        } else {
            loading.classList.add("hidden")
            alertMessage("error", "Não foi possível processar a requisição.")
        }
    } catch (error) {
        console.log(error);
        alertMessage("error", "Não foi possível processar a requisição.")
        loading.classList.add("hidden")
    }
}

uploadImagesInput.addEventListener('change', uploadImages);
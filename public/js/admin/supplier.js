const divMaterials = document.getElementById("materials")
const newMaterialButton = document.getElementById("newMaterial")

function newMaterial() {
    var chars = 'abcdefghijklmnopqrstuvwxyz';
    var id = '';

    for (var i = 0; i < chars.length; i++) {
        var random = Math.floor(Math.random() * chars.length);
        id += chars.charAt(random);
    }

    const html = `
      <div id='${id}' class="material grid grid-cols-4 gap-x-3 mt-2">
        <div class="col-span-3">
          <div class="relative mt-2 rounded-lg shadow-sm item-div">
            <input type="text" id="item" class="block w-full rounded-lg inter py-1.5 mt-2 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 border-blue-1" placeholder="Nome da peça/material">
          </div>
        </div>

        <div class="flex items-center col-span-1">
          <div class="flex flex-col">
            <div class="relative rounded-lg shadow-sm item-div">
              <input type="text" id="manufacturer" class="block w-full rounded-lg inter py-1.5 mt-2 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 sm:text-sm sm:leading-6 border-blue-1" placeholder="Nome do fabricante">
            </div>
          </div>

          <button onclick="deleteNewElement(${id})" class="ml-2 mr-1">
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_236_23)">
              <mask id="mask0_236_23" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="18">
              <path d="M16 0H0V18H16V0Z" fill="white"/>
              </mask>
              <g mask="url(#mask0_236_23)">
              <path d="M14.125 4.625L13.3661 15.2497C13.3007 16.1655 12.5387 16.875 11.6205 16.875H4.37946C3.46134 16.875 2.69932 16.1655 2.63391 15.2497L1.875 4.625M6.25 8.125V13.375M9.75 8.125V13.375M10.625 4.625V2C10.625 1.51675 10.2332 1.125 9.75 1.125H6.25C5.76675 1.125 5.375 1.51675 5.375 2V4.625M1 4.625H15" stroke="#239CFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              </g>
              <defs>
              <clipPath id="clip0_236_23">
              <rect width="16" height="18" fill="white"/>
              </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
    `;

    divMaterials.insertAdjacentHTML("beforeend", html);
}

function deleteNewElement(element) {
    element.remove()
}

function deleteExistingElement(id) {
    const element = document.getElementById(id)

    element.remove()
}

function formatCEP(input) {
    const value = input.value.replace(/\D/g, '').substring(0, 8);

    if (value.length > 5) {
        input.value = value.substring(0, 5) + '-' + value.substring(5);
    } else {
        input.value = value;
    }
}

async function newSupplier() {
    const name = document.getElementById("name")
    const email = document.getElementById("email")
    const address = document.getElementById("address")
    const landline = document.getElementById("landline")
    const phone = document.getElementById("phone")
    const cep = document.getElementById("cep")
    const city = document.getElementById("city")
    const contactName = document.getElementById("contactName")
    const comments = document.getElementById("comments")

    const materials = document.getElementsByClassName('material')
    const materialsArray = []

    if (name.value.length == 0) {
        alertMessage("error", "Preencha o nome do fornecedor")
        return
    }

    for (var i = 0; i < materials.length; i++) {
        const item = materials[i].querySelector("#item");
        const manufacturer = materials[i].querySelector("#manufacturer");

        materialsArray.push({ item: item.value, manufacturer: manufacturer.value })
    }

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch('/admin/new-supplier/save', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, email: email.value, landline: landline.value, phone: phone.value, address: address.value, cep: cep.value, city: city.value, contactName: contactName.value, materials: materialsArray, comments: comments.value })
    })
        .then(async (response) => {
            if (response.status == 200) {
                loading.classList.add("hidden")
                alertMessage("success", "Fornecedor adicionado com sucesso.")
            } else {
                const data = await response.json()
    
                loading.classList.add("hidden")
                alertMessage("error", data.error)
            }
        })
        .catch((error) => {
            loading.classList.add("hidden")
            alertMessage("error", "Tente novamente mais tarde")
        })
}

async function updateSupplier(id) {
    const name = document.getElementById("name")
    const email = document.getElementById("email")
    const address = document.getElementById("address")
    const landline = document.getElementById("landline")
    const phone = document.getElementById("phone")
    const cep = document.getElementById("cep")
    const city = document.getElementById("city")
    const contactName = document.getElementById("contactName")
    const comments = document.getElementById("comments")

    const materials = document.getElementsByClassName('material')
    const materialsArray = []

    if (name.value.length == 0) {
        alertMessage("error", "Preencha o nome do fornecedor")
        return
    }

    for (var i = 0; i < materials.length; i++) {
        const item = materials[i].querySelector("#item");
        const manufacturer = materials[i].querySelector("#manufacturer");

        materialsArray.push({ item: item.value, manufacturer: manufacturer.value })
    }

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch(`/admin/update-supplier/save/${id}`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, email: email.value, landline: landline.value, phone: phone.value, address: address.value, cep: cep.value, city: city.value, contactName: contactName.value, materials: materialsArray, comments: comments.value })
    })
        .then(async (response) => {
            if (response.status == 200) {
                loading.classList.add("hidden")
                alertMessage("success", "Fornecedor atualizado com sucesso.")
            } else {
                const data = await response.json()
    
                loading.classList.add("hidden")
                alertMessage("error", data.error)
            }
        })
        .catch((error) => {
            loading.classList.add("hidden")
            alertMessage("error", "Tente novamente mais tarde")
        })
}
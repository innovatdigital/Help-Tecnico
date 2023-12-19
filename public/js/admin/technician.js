async function newTechnician() {
    const name = document.getElementById("name")
    const cpf = document.getElementById("cpf")
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const phone = document.getElementById("phone")
    const city = document.getElementById("city")
    const address = document.getElementById("address")
    const cep = document.getElementById("cep")
    const cnh = document.getElementById("cnh")
    const carModel = document.getElementById("car-model")
    const carPlate = document.getElementById("car-plate")
    const carColor = document.getElementById("car-color")
    const comments = document.getElementById("comments")

    if (name.value.length == 0) {
        alertMessage("error", "Preencha o nome do técnico")
        return
    }

    if (cpf.value.length == 0) {
        alertMessage("error", "Preencha o CPF do técnico")
        return
    }

    if (email.value.length == 0) {
        alertMessage("error", "Preencha o email do técnico")
        return
    }

    if (password.value.length == 0) {
        alertMessage("error", "Preencha a senha do técnico")
        return
    }

    if (phone.value.length == 0) {
        alertMessage("error", "Preencha o telefone do técnico")
        return
    }

    if (city.value == "select") {
        alertMessage("error", "Selecione a cidade do técnico")
        return
    }

    if (address.value.length == 0) {
        alertMessage("error", "Preencha o endereço do técnico")
        return
    }

    if (cep.value.length == 0) {
        alertMessage("error", "Preencha o CEP do técnico")
        return
    }

    if (cnh.value.length == 0) {
        alertMessage("error", "Preencha a CNH do técnico")
        return
    }

    if (carModel.value.length == 0) {
        alertMessage("error", "Informe o modelo do carro")
        return
    }

    if (carPlate.value.length == 0) {
        alertMessage("error", "Informe a placa do carro")
        return
    }

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch('/admin/new-technician/save', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, cpf: cpf.value, email: email.value, password: password.value, phone: phone.value, city: city.value, address: address.value, cep: cep.value, cnh: cnh.value, carModel: carModel.value, carPlate: carPlate.value, carColor: carColor.value, comments: comments.value })
    })
        .then(async (response) => {
            if (response.status == 200) {
                loading.classList.add("hidden")
                alertMessage("success", "Técnico adicionado com sucesso.")
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

async function updateTechnician(id) {
    const name = document.getElementById("name")
    const cpf = document.getElementById("cpf")
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const phone = document.getElementById("phone")
    const city = document.getElementById("city")
    const address = document.getElementById("address")
    const cep = document.getElementById("cep")
    const cnh = document.getElementById("cnh")
    const carModel = document.getElementById("car-model")
    const carPlate = document.getElementById("car-plate")
    const carColor = document.getElementById("car-color")
    const comments = document.getElementById("comments")

    if (name.value.length == 0) {
        alertMessage("error", "Preencha o nome do técnico")
        return
    }

    if (cpf.value.length == 0) {
        alertMessage("error", "Preencha o CPF do técnico")
        return
    }

    if (email.value.length == 0) {
        alertMessage("error", "Preencha o email do técnico")
        return
    }

    if (password.value.length == 0) {
        alertMessage("error", "Preencha a senha do técnico")
        return
    }

    if (phone.value.length == 0) {
        alertMessage("error", "Preencha o telefone do técnico")
        return
    }

    if (city.value == "select") {
        alertMessage("error", "Selecione a cidade do técnico")
        return
    }

    if (address.value.length == 0) {
        alertMessage("error", "Preencha o endereço do técnico")
        return
    }

    if (cep.value.length == 0) {
        alertMessage("error", "Preencha o CEP do técnico")
        return
    }

    if (cnh.value.length == 0) {
        alertMessage("error", "Preencha a CNH do técnico")
        return
    }

    if (carModel.value.length == 0) {
        alertMessage("error", "Informe o modelo do carro")
        return
    }

    if (carPlate.value.length == 0) {
        alertMessage("error", "Informe a placa do carro")
        return
    }

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch(`/admin/update-technician/save/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, cpf: cpf.value, email: email.value, password: password.value, phone: phone.value, city: city.value, address: address.value, cep: cep.value, cnh: cnh.value, carModel: carModel.value, carPlate: carPlate.value, carColor: carColor.value, comments: comments.value })
    })
        .then(async (response) => {
            if (response.status == 200) {
                loading.classList.add("hidden")
                alertMessage("success", "Técnico atualizado com sucesso.")
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
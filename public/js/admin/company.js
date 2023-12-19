async function newCompany() {
    const name = document.getElementById("name")
    const cnpj = document.getElementById("cnpj")
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const phoneResponsible = document.getElementById("responsible-phone")
    const phoneCompany = document.getElementById("company-phone")
    const address = document.getElementById("address")
    const cep = document.getElementById("cep")
    const city = document.getElementById("city")
    const comments = document.getElementById("comments")
    const service = document.getElementById("service")
    const technician = document.getElementById("technician")

    if (name.value.length == 0) {
        alertMessage("error", "Preencha o nome da empresa")
        return
    }

    if (cnpj.value.length == 0) {
        alertMessage("error", "Preencha o CNPJ da empresa")
        return
    }

    if (email.value.length == 0) {
        alertMessage("error", "Preencha o email da empresa")
        return
    }

    if (password.value.length == 0) {
        alertMessage("error", "Insira a senha da empresa")
        return
    }

    if (phoneResponsible.value.length == 0) {
        alertMessage("error", "Preencha o telefone do responsável")
        return
    }

    if (phoneCompany.value.length == 0) {
        alertMessage("error", "Preencha o telefone da empresa")
        return
    }

    if (address.value.length == 0) {
        alertMessage("error", "Preencha o endereço da empresa")
        return
    }

    if (cep.value.length == 0) {
        alertMessage("error", "Preencha o CEP da empresa")
        return
    }

    if (city.value == "select") {
        alertMessage("error", "Selecione a cidade da empresa")
        return
    }

    if (service.value == "select") {
        alertMessage("error", "Selecione o tipo de serviço")
        return
    }

    if (technician.value == "select") {
        alertMessage("error", "Selecione o técnico responsável")
        return
    }

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch('/admin/new-company/save', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, cnpj: cnpj.value, email: email.value, password: password.value, phoneResponsible: phoneResponsible.value, phoneCompany: phoneCompany.value, city: city.value, address: address.value, cep: cep.value, service: service.value, comments: comments.value, technician: technician.value })
    })
        .then(async (response) => {
            if (response.status == 200) {
                loading.classList.add("hidden")
                alertMessage("success", "Empresa adicionada com sucesso.")
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

async function updateCompany(id) {
    const name = document.getElementById("name")
    const cnpj = document.getElementById("cnpj")
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const phoneResponsible = document.getElementById("responsible-phone")
    const phoneCompany = document.getElementById("company-phone")
    const address = document.getElementById("address")
    const cep = document.getElementById("cep")
    const city = document.getElementById("city")
    const comments = document.getElementById("comments")
    const service = document.getElementById("service")
    const technician = document.getElementById("technician")

    if (name.value.length == 0) {
        alertMessage("error", "Preencha o nome da empresa")
        return
    }

    if (cnpj.value.length == 0) {
        alertMessage("error", "Preencha o CNPJ da empresa")
        return
    }

    if (email.value.length == 0) {
        alertMessage("error", "Preencha o email da empresa")
        return
    }

    if (password.value.length == 0) {
        alertMessage("error", "Insira a senha da empresa")
        return
    }

    if (phoneResponsible.value.length == 0) {
        alertMessage("error", "Preencha o telefone do responsável")
        return
    }

    if (phoneCompany.value.length == 0) {
        alertMessage("error", "Preencha o telefone da empresa")
        return
    }

    if (address.value.length == 0) {
        alertMessage("error", "Preencha o endereço da empresa")
        return
    }

    if (cep.value.length == 0) {
        alertMessage("error", "Preencha o CEP da empresa")
        return
    }

    if (city.value == "select") {
        alertMessage("error", "Selecione a cidade da empresa")
        return
    }

    if (service.value == "select") {
        alertMessage("error", "Selecione o tipo de serviço")
        return
    }

    if (technician.value == "select") {
        alertMessage("error", "Selecione o técnico responsável")
        return
    }

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch(`/admin/update-company/save/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, cnpj: cnpj.value, email: email.value, password: password.value, phoneResponsible: phoneResponsible.value, phoneCompany: phoneCompany.value, city: city.value, address: address.value, cep: cep.value, service: service.value, comments: comments.value, technician: technician.value })
    })
        .then(async (response) => {
            if (response.status == 200) {
                loading.classList.add("hidden")
                alertMessage("success", "Empresa atualizada com sucesso.")
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
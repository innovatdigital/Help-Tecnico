let idAdmin;

function openDelete(id) {
    idAdmin = id

    const delete_popup = document.querySelector("#popup_delete")

    delete_popup.classList.remove("hidden")
}

function closeDelete() {
    const delete_popup = document.querySelector("#popup_delete")

    delete_popup.classList.add("hidden")
}

function deleteAdmin() {
    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch(`/admin/delete-admin/${idAdmin}`, {
        method: 'DELETE',
    })
        .then(async (response) => {
            if (response.status == 200) {
                location.reload()
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

async function newAdmin() {
    const name = document.getElementById("name")
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const phone = document.getElementById("phone")
    const comments = document.getElementById("comments")

    if (name.value.length == 0) {
        alertMessage("error", "Preencha o nome")
        return
    }

    if (email.value.length == 0) {
        alertMessage("error", "Preencha o email")
        return
    }

    if (password.value.length == 0) {
        alertMessage("error", "Preencha a senha")
        return
    }

    if (phone.value.length == 0) {
        alertMessage("error", "Preencha o telefone")
        return
    }

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch('/admin/new-admin/save', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, email: email.value, password: password.value, phone: phone.value, comments: comments.value })
    })
        .then(async (response) => {
            if (response.status == 200) {
                loading.classList.add("hidden")
                alertMessage("success", "Administrador adicionado com sucesso.")
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

async function updateAdmin(id) {
    const name = document.getElementById("name")
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const phone = document.getElementById("phone")
    const comments = document.getElementById("comments")

    if (name.value.length == 0) {
        alertMessage("error", "Preencha o nome")
        return
    }

    if (email.value.length == 0) {
        alertMessage("error", "Preencha o email")
        return
    }

    if (password.value.length == 0) {
        alertMessage("error", "Preencha a senha")
        return
    }

    if (phone.value.length == 0) {
        alertMessage("error", "Preencha o telefone")
        return
    }

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch(`/admin/update-admin/save/${id}`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, email: email.value, password: password.value, phone: phone.value, comments: comments.value })
    })
        .then(async (response) => {
            if (response.status == 200) {
                loading.classList.add("hidden")
                alertMessage("success", "Administrador atualizado com sucesso.")
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
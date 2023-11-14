function openSection(sectionId) {
    const sections = ['account', 'security'];

    sections.forEach((id) => {
        const element = document.querySelector(`#${id}`);
        if (id === sectionId) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
}

async function updatePassword() {
    const currentPassword = document.querySelector("#current-password")
    const newPassword = document.querySelector("#new-password")
    const confirmPassword = document.querySelector("#confirm-password")

    if (currentPassword.value.length == 0) {
        alertMessage("error", "Insira a senha atual")
        return
    }

    if (newPassword.value.length == 0) {
        alertMessage("error", "Insira a nova senha")
        return
    }

    if (confirmPassword.value.length == 0) {
        alertMessage("error", "Confirme a nova senha")
        return
    }

    const loading = document.getElementById("loading")
    loading.classList.remove("hidden")

    fetch('/company/settings/update-password', {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword: currentPassword.value, newPassword: newPassword.value, confirmPassword: confirmPassword.value })
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
        alertMessage("error", error)
    })
}

function updateAvatar(input) {
    const formData = new FormData();
    formData.append('image', input.target.files[0]);

    fetch('/company/settings/update-avatar', {
        method: 'PUT',
        body: formData
    })
    .then((response) => {
        const data = response.json()

        if (response.status == 200) {
            location.reload()
        } else {
            loading.classList.add("hidden")
            alertMessage("error", data.error)
        }
    })
    .catch((error) => {
        loading.classList.add("hidden")
        alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
    })
}

document.getElementById("avatar-input").addEventListener('change', updateAvatar);
let runningReset = false

async function resetPassword() {
    if (!runningReset) {
        runningReset = true

        const password = document.querySelector("#password")

        if (password.value.length < 8) {
            alertMessage("error", "A senha deve conter 8 caracteres ou mais")
            runningReset = false
            return
        }

        const loading = document.querySelector("#loading")
        loading.classList.remove("hidden")

        const scriptTag = document.querySelector("script[src='/js/auth/reset-password.js']");
        const token = scriptTag.getAttribute("token")

        fetch(`/auth/reset-password/${token}`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: password.value })
        })
            .then(async(response) => {
                if (response.status == 200) {
                    location.href = "/auth"
                } else {
                    const data = await response.json();

                    runningReset = false
                    loading.classList.add("hidden")

                    alertMessage("error", data.error)
                }
            })
            .catch((error) => {
                runningReset = false
                loading.classList.add("hidden")
                alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
            })
    }
}

document.addEventListener('keypress', function(e) {
    if (e.which == 13) {
      resetPassword();
    }
}, false);
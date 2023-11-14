let runningForgot = false

async function forgotPassword() {
    if (!runningForgot) {
        runningForgot = true

        const email = document.querySelector("#email")

        if (email.value.length == 0) {
            alertMessage("error", "Preencha o email")
            runningForgot = false
            return
        }

        const loading = document.querySelector("#loading")
        loading.classList.remove("hidden")

        fetch("/auth/forgot-password/send-token", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value })
        })
            .then(async(response) => {
                runningForgot = false
                loading.classList.add("hidden")

                if (response.status == 200) {
                    alertMessage("success", "Link de redefinição de senha enviado com sucesso!")
                } else {
                    const data = await response.json();

                    alertMessage("error", data.error)
                }
            })
            .catch((error) => {
                runningForgot = false
                loading.classList.add("hidden")
                alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
            })
    }
}

document.addEventListener('keypress', function(e) {
    if (e.which == 13) {
      forgotPassword();
    }
}, false);
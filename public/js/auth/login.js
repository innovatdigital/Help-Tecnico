let runningLogin = false

async function login() {
    if (!runningLogin) {
        runningLogin = true

        const email = document.querySelector("#email")
        const password = document.querySelector("#password")

        if (email.value.length == 0) {
            alertMessage("error", "Preencha o email")
            runningLogin = false
            return
        }

        if (password.value.length == 0) {
            alertMessage("error", "Preencha a senha")
            runningLogin = false
            return
        }

        const loading = document.querySelector("#loading")
        loading.classList.remove("hidden")

        fetch("/auth/handle-login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email.value, password: password.value })
        })
            .then(async(response) => {
                const data = await response.json();

                if (response.status == 200) {
                    const now = new Date();
                    const expires = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);
                    document.cookie = `token=${data.token}; expires=${expires.toUTCString()}; path=/`

                    if (data.roles.includes("ADMIN")) {
                        location.href = "/admin/"
                    } else if (data.roles.includes("COMPANY")) {
                        location.href = "/company/"
                    } else if (data.roles.includes("TECHNICIAN")) {
                        location.href = "/technician/calls"
                    }
                } else {
                    runningLogin = false
                    loading.classList.add("hidden")
                    alertMessage("error", data.error)
                }
            })
            .catch((error) => {
                runningLogin = false
                loading.classList.add("hidden")
                alertMessage("error", "Não foi possível estabeler a conexão com o servidor.")
            })
    }
}

document.addEventListener('keypress', function(e) {
    if (e.which == 13) {
      login();
    }
}, false);
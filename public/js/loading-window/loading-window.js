function openLoading(boolean) {
    const loading = document.querySelector("#loading")

    if (boolean) {
        loading.classList.remove("hidden")
    } else {
        loading.classList.add("hidden")
    }
}
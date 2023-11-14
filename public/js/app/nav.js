const sidebarMobile = document.getElementById('sidebar-mobile')
const openSidebarMobile = document.getElementById('open-sidebar-mobile')
const closeSidebarMobile = document.getElementById('close-sidebar-mobile')

openSidebarMobile.addEventListener('click', () => {
    sidebarMobile.classList.remove("hidden")
})

closeSidebarMobile.addEventListener('click', () => {
    sidebarMobile.classList.add("hidden")
})
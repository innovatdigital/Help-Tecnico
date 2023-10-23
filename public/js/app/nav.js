const sidebarMobile = document.querySelector('#sidebar-mobile')
const openSidebarMobile = document.querySelector('#open-sidebar-mobile')
const closeSidebarMobile = document.querySelector('#close-sidebar-mobile')

openSidebarMobile.addEventListener('click', () => {
    sidebarMobile.classList.remove("hidden")
})

closeSidebarMobile.addEventListener('click', () => {
    sidebarMobile.classList.add("hidden")
})
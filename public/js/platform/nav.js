const userMenu = document.querySelector('#user-menu')
const openMenu = document.querySelector('#open-menu')
const sidebarMobile = document.querySelector('#sidebar-mobile')
const openSidebarMobile = document.querySelector('#open-sidebar-mobile')
const closeSidebarMobile = document.querySelector('#close-sidebar-mobile')

let open = false

openMenu.addEventListener('click', () => {
    if (open) {
        userMenu.style.display = "none"
        userMenu.classList.remove("fade-in")
        userMenu.classList.add("fade-off")
        open = false
    } else {
        userMenu.style.display = "block"
        userMenu.classList.remove("fade-off")
        userMenu.classList.add("fade-in")
        open = true
    }
})

openSidebarMobile.addEventListener('click', () => {
    sidebarMobile.classList.remove("hidden")
})

closeSidebarMobile.addEventListener('click', () => {
    sidebarMobile.classList.add("hidden")
})
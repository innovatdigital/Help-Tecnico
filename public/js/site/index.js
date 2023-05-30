const btnCloseMobile = document.querySelector('.close-menu')
const btnOpenMobile = document.querySelector('.open-menu')
const menuMobile = document.querySelector('.menu')

btnCloseMobile.addEventListener('click', () => {
    menuMobile.style.visibility = "hidden"
})

btnOpenMobile.addEventListener('click', () => {
    menuMobile.style.visibility = "visible"
})
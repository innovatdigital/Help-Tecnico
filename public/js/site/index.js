const mobile = document.querySelector('#btn-mobile')
const close = document.querySelector('#close-menu')
const menu = document.querySelector('.menu-div')

mobile.addEventListener('click', function() {
    menu.classList.add('menu-div-show')
})

close.addEventListener('click', function() {
    menu.classList.remove('menu-div-show')
})
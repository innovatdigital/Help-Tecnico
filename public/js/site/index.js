const mobile = document.querySelector('#btn-mobile')

mobile.addEventListener('click', function() {
    const nav = document.querySelector('nav')
    nav.classList.toggle('active')
})
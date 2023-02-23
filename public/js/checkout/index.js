const name = document.querySelector("#name");
const number = document.querySelector("#number");
const cpf = document.querySelector("#cpf");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const btn = document.querySelector(".btn-continue");
const title = document.querySelector(".title");

$('.card').hide();
$('.pix').hide();
$('.pag-pix').hide();
$('.pag-card').hide();
$('.card-form').hide();

btn.addEventListener("click", function() {
    let error = 0

    if (name.value == "" || name.length <= 3) { name.style.border = "red"; error++}
    if (number.value == "" || number.length <= 3) { number.style.border = "red"; error++}
    if (cpf.value == "" || cpf.length <= 3) { cpf.style.border = "red"; error++}
    if (email.value == "" || email.length <= 3) { email.style.border = "red"; error++}
    if (password.value == "" || password.length <= 3) { password.style.border = "red"; error++}

    if (error == 0) {
        $('.form-floating').hide();
        $('.box-option').hide();
        $('.pag-card').show();
    }                
});

$('input[name="pag"]').change(function () {
    if ($('input[name="pag"]:checked').val() === "CARD") {
        $('.box-option').hide();
        $('.pag-card').show();
    } else {
        $('.box-option').show();
    }
});

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

    if (name.value == "" || name.length <= 3) { name.style.border = "3px solid red"; error++}
    if (number.value == "" || number.length <= 3) { number.style.border = "3px solid red"; error++}
    if (cpf.value == "" || cpf.length <= 3) {cpf.style.border = "3px solid red"; error++}
    if (email.value == "" || email.length <= 3) { email.style.border = "3px solid red"; error++}
    if (password.value == "" || password.length <= 3) { password.style.border = "3px solid red"; error++}

    if (validCpf() == false) {
        cpf.style.border = "3px solid red"; error++
    }

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

function validCpf() {
    var cpf = document.getElementById("cpf").value;
    cpf = cpf.replace(/[^\d]+/g,'');

    if(cpf == '') {
        return false;
    }

    if(cpf.length != 11 || /^(\d)\1+$/.test(cpf)) {
        document.getElementById("cpf").setCustomValidity("CPF inválido");
        return false;
    }

    var add = 0;
    for (i=0; i < 9; i ++) {
        add += parseInt(cpf.charAt(i)) * (10 - i);
    }
    var rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
        rev = 0;
    }
    if (rev != parseInt(cpf.charAt(9))) {
        document.getElementById("cpf").setCustomValidity("CPF inválido");
        return false;
    }

    add = 0;
    for (i = 0; i < 10; i ++) {
        add += parseInt(cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (add % 11);
    if (rev == 10 || rev == 11) {
        rev = 0;
    }
    if (rev != parseInt(cpf.charAt(10))) {
        document.getElementById("cpf").setCustomValidity("CPF inválido");
        return false;
    }

    document.getElementById("cpf").setCustomValidity('');
    return true
}
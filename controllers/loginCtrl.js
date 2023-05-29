const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const cookie = require('cookie');

const Page = asyncHandler(async(req, res) => {
    res.render('layouts/login')
})

const Login = asyncHandler(async(req, res) => {
    const find = await User.findOne({email: req.body.email.trim(), password: req.body.password.trim()})

    if (find) {
        if (find.isBloqued == false) {
            const cookieObj = cookie.serialize('_id', find._id, {
                domain: 'plubee.net',
                path: '/',
                httpOnly: true,
                secure: true,
                sameSite: 'strict'
            });
    
            // Define o cookie no cabeçalho da resposta
            res.setHeader('Set-Cookie', cookieObj);
    
            res.send({auth: true})
        } else {
            res.send({auth: false})
        }
    } else {
        res.send({auth: false})
    }
})

const Register = asyncHandler(async(req, res) => {
    const { name, cpf, number, email, password, type_account } = req.body

    console.log(req.body)
    console.log(cpf)


    // const encryptPassword = bcrypt.hash(password, 10)

    try {
        const find = await User.findOne({email: email, cpf: cpf})
        
        const data = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(data);

        if (find) {
            res.send("Usuário já inserido.")
        } else {
            const newUser = await User.create({name: name, cpf: cpf, number: number, email: email, date: dataFormat, password: password, type_account: type_account, isAdmin: isAdmin})
            res.send('Inserido')    
        }
    } catch (err) {
        res.send(err)
    }
})

module.exports = 
{   Page,
    Login,
    Register
}
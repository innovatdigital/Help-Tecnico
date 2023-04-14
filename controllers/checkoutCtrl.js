const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Plans = require('../models/Plans')
const Finances = require('../models/Finances')
const axios = require('axios')
const ejs = require('ejs');
const mercadopago = require('mercadopago');
const fs = require('fs')
const nodemailer = require('nodemailer');

async function aprovedEmail(infos) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    
    const emailTemplate = fs.readFileSync('./views/layouts/aproved.ejs', 'utf-8');

    const html = ejs.render(emailTemplate, infos);

    let mailOptions = {
        from: '"PluBee" plubee.net',
        to: infos.email,
        subject: 'Compra aprovada com sucesso!',
        text: 'Você já pode aproveitar todos os benefícios da nossa plataforma!',
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        }
    });
}

const checkout = asyncHandler(async(req, res) => {
    const findPlan = await Plans.findById(req.params.id)

    res.render("layouts/checkout", {planInfo: findPlan, APP_USER: process.env.MERCADO_PUBLIC})
})

const checkUser = asyncHandler(async(req, res) => {
    const find = await User.findOne({email: req.body.account.email, cpf: req.body.account.cpf})
    if (find) res.send('Usuário já cadastrado.')
})

const processPayment = asyncHandler(async(req, res) => {
    // const find = await User.findOne({email: req.body.account.email, cpf: req.body.account.cpf})
    // if (find) res.send('Usuário já cadastrado.')
    const paymentData = {
        transaction_amount: parseFloat(req.body.account.amount),
        token: req.body.cardFormData.token,
        description: req.body.cardFormData.description,
        installments: Number(req.body.cardFormData.installments),
        payment_method_id: req.body.cardFormData.paymentMethodId,
        issuer_id: req.body.cardFormData.issuerId,
        payer: {
            email: req.body.cardFormData.payer.email,
            identification: {
                type: req.body.cardFormData.payer.identification.docType,
                number: req.body.cardFormData.payer.identification.docNumber
            }
        }
    };

    mercadopago.configurations.setAccessToken(process.env.MERCADO_ACCESS)

    mercadopago.payment.save(paymentData)
    .then(function(response) {
        const { response: data } = response;

        setTimeout(() => {
            axios.get(`https://api.mercadopago.com/v1/payments/${response.body.id}?access_token=${process.env.MERCADO_ACCESS}`)
            .then(async(data) => {
                const payment = data.data;

                if (payment.status == 'approved') {
                    try {
                        const data = Date.now();
                        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
                        const formater = new Intl.DateTimeFormat('pt-BR', options);
                        const dataFormat = formater.format(data);

                        var dataAtual = new Date();
                        var day = dataAtual.getDate();
                        var mes = dataAtual.getMonth() + 1;
                        var ano = dataAtual.getFullYear()

                        let plan = ''

                        if (req.body.account.type_account == "BÁSICO") {
                            plan = "Basico"
                        } else if (req.body.account.type_account == "PRO") {
                            plan = "Pro"
                        } else if (req.body.account.type_account == "AVANÇADO") {
                            plan = "Avançado"
                        }
                
                        const find = await User.findOne({email: req.body.account.email.trim()})
                        if (find) {
                            const update = await User.findByIdAndUpdate(find._id, {name: req.body.account.name, cpf: req.body.account.cpf, number: req.body.account.number, email: req.body.account.email, date: dataFormat, password: req.body.account.password, type_account: plan})
                            const saveFinance = await Finances.create({idUser: update._id, value: paymentData.transaction_amount, day: day, month: mes, year: ano, email: req.body.account.email, status: "Aprovado", plan: req.body.account.type_account})
                        } else {
                            const newUser = await User.create({name: req.body.account.name, cpf: req.body.account.cpf, number: req.body.account.number, email: req.body.account.email, date: dataFormat, password: req.body.account.password, type_account: plan})
                            const saveFinance = await Finances.create({idUser: newUser._id, value: paymentData.transaction_amount, day: day, month: mes, year: ano, email: req.body.account.email, status: "Aprovado", plan: req.body.account.type_account})
                        }
                        
                        let infos = {
                            id: response.body.id,
                            value: req.body.cardFormData.amount,
                            name: req.body.account.name,
                            cpf: req.body.account.cpf,
                            date: dataFormat,
                            plan: req.body.account.type_account,
                            email: req.body.account.email,
                            password: req.body.account.password,
                        }

                        aprovedEmail(infos)

                        res.send({approved: true})

                    } catch (err) {
                        console.log(err)
                        res.sendStatus(500)
                    }     
                } else {
                    res.sendStatus(500)
                }
            })
            .catch((error) => {
                console.log(error)
                res.send('Ocorreu um erro ao processar o pagamento, tente novamente mais tarde.')
            });
        }, 6000)
    })
    .catch(function(error) { 
        console.log(error)
    });       
})

module.exports = 
{   checkout,
    checkUser,
    processPayment
}
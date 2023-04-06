const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Plans = require('../models/Plans')
const Finances = require('../models/Finances')
const axios = require('axios')
const ejs = require('ejs');
const mercadopago = require('mercadopago');
const fs = require('fs')
const nodemailer = require('nodemailer');

mercadopago.configure({
    access_token: `${process.env.MERCADO_ACCESS}`
});

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
    
    const emailTemplate = fs.readFileSync('./views/layouts/aproved_email.ejs', 'utf-8');

    const html = ejs.render(emailTemplate, infos);

    let mailOptions = {
        from: '"PluBee" vagner12lemos@gmail.com',
        to: infos.email,
        subject: 'Compra aprovada com sucesso!',
        text: 'Você já pode aproveitar todos os benefícios da nossa plataforma!',
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Mensagem enviada: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
}

const checkout = asyncHandler(async(req, res) => {
    const findPlan = await Plans.findById(req.params.id)

    res.render("layouts/checkout", {planInfo: findPlan, APP_USER: process.env.MERCADO_PUBLIC})
})

const processPayment = asyncHandler(async(req, res) => {
    const find = await User.findOne({email: req.body.account.email, cpf: req.body.account.cpf})
    if (find) res.send('Usuário já cadastrado.')
    else {
        const paymentData = {
            transaction_amount: req.body.cardFormData.amount,
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
    
        mercadopago.payment.save(paymentData)
        .then(function(response) {
            const { response: data } = response;
    
            axios.get(`https://api.mercadopago.com/v1/payments/${response.body.id}?access_token=APP_USR-1680886342878290-011613-a8697bc1e7bdc9a7003609de727629c1-810849321`)
                .then(async(response) => {
                    const payment = response.data;
                    console.log(payment.status)
                    if (payment.status === 'approved') {
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
                    
                            const newUser = await User.create({name: req.body.account.name, cpf: req.body.account.cpf, number: req.body.account.number, email: req.body.account.email, date: dataFormat, password: req.body.account.password, type_account: plan})
                            const saveFinance = await Finances.create({idUser: newUser._id, value: paymentData.transaction_amount, day: day, month: mes, year: ano, email: req.body.account.email, status: "Aprovado", plan: req.body.account.type_account})
 
                            let infos = {
                                id: response.body.id,
                                value: req.body.cardFormData.amount,
                                name: req.body.account.name,
                                cpf: req.body.account.cpf,
                                date: dataFormat,
                                plan: req.body.account.type_account,
                                email: req.body.cardFormData.payer.email
                            }

                            aprovedEmail(infos)

                            res.send({approved: true})

                        } catch (err) {
                            res.send('ds')
                        }     
                    } else {
                        try {
                            res.send({approved: false})
                        } catch (err) {
                            res.send(err)
                        }     
                    }
                })
                .catch((error) => {
                    res.send('Ocorreu um erro ao processar o pagamento, tente novamente mais tarde.')
                });
        })
        .catch(function(error) {
            console.log(error)
        });       
    
    }
})

const processPaymentTest = asyncHandler(async(req, res) => {
    const data = Date.now();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formater = new Intl.DateTimeFormat('pt-BR', options);
    const dataFormat = formater.format(data);

    var dataAtual = new Date();
    var day = dataAtual.getDate();
    var mes = dataAtual.getMonth() + 1;
    var ano = dataAtual.getFullYear()

    let infos = {
        id: req.body.id,
        value: req.body.value,
        name: req.body.name,
        cpf: req.body.cpf,
        date: dataFormat,
        plan: req.body.type_account,
        email: req.body.email
    }

    aprovedEmail(infos)

    res.send({approved: true})
})


module.exports = 
{   checkout,
    processPayment,
    processPaymentTest
}
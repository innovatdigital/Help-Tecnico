const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Plans = require('../models/Plans')
const Finances = require('../models/Finances')
const bcrypt = require('bcrypt');
const fbgraph = require('fbgraph');
const fb = require('fb');
const axios = require('axios')
const mercadopago = require('mercadopago');
const nodemailer = require('nodemailer');

mercadopago.configure({
    access_token: 'APP_USR-1680886342878290-011613-a8697bc1e7bdc9a7003609de727629c1-810849321'
});

async function aprovedEmail(email, value, id) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true para 465, false para outras portas
        auth: {
            user: 'vagner12lemos@gmail.com',
            pass: 'qrbjshaakihsgkhl'
        }
    });

    let mailOptions = {
        from: '"PluBee" vagner12lemos@gmail.com',
        to: email,
        subject: 'Compra aprovada com sucesso!',
        text: 'Conteúdo do email em texto puro',
        html: '<b>Conteúdo do email em HTML</b>'
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

    res.render("layouts/checkout", {planInfo: findPlan})
})


const processPayment = asyncHandler(async(req, res) => {
    const find = await User.findOne({email: req.body.account.email, cpf: req.body.account.cpf})
    if (find) res.send('Usuário já cadastrado.')
    else {
        const paymentData = {
            transaction_amount: 1,
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
                    
                            const newUser = await User.create({name: req.body.account.name, cpf: req.body.account.cpf, number: req.body.account.number, email: req.body.account.email, date: dataFormat, password: req.body.account.password, type_account: req.body.account.type_account})
                            const saveFinance = await Finances.create({idUser: newUser._id, value: paymentData.transaction_amount, day: day, month: mes, year: ano, email: req.body.account.email, status: "Aprovado", plan: "Pro"})
 
                            res.send({approved: true})

                        } catch (err) {
                            res.send('ds')
                        }     
                    } else {
                        // console
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

module.exports = 
{   checkout,
    processPayment
}
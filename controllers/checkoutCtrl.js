const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Plans = require('../models/Plans')
const Finances = require('../models/Finances')
const Checkout = require('../models/Checkout')
const axios = require('axios')
const ejs = require('ejs');
const mercadopago = require('mercadopago');
const fs = require('fs')
const nodemailer = require('nodemailer');
const stripe = require("stripe")("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")

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
    });
}

const checkout = asyncHandler(async(req, res) => {
    const findPlan = await Plans.findOne({"name_checkout": req.params.name_checkout})

    if (findPlan) {
        res.render("layouts/checkout", {name_checkout: findPlan.name_checkout, plan: findPlan})
    } else {
        res.render("layouts/notFound")
    }
})

const createPayment = asyncHandler(async(req, res) => {
    try {
        const findPlan = await Plans.findOne({"name_checkout": req.params.name_checkout})

        const customer = await stripe.customers.create({
            name: `${req.body.user.firstName} ${req.body.user.lastName}`,
            email: req.body.user.email,
            phone: req.body.user.phone
        });

        const paymentIntent = await stripe.paymentIntents.create({
            customer: customer.id,
            setup_future_usage: 'off_session',
            amount: parseFloat(findPlan.value_month) * 100,
            currency: "brl",
            automatic_payment_methods: {
                enabled: true,
            },
        });
        
        const saveDetails = await Checkout.create({first_name: req.body.user.firstName, last_name: req.body.user.lastName, password: req.body.user.password, email: req.body.user.email, number: req.body.user.phone, cpf: req.body.user.cpf, id_payment: paymentIntent.client_secret.split("_")[1], plan: findPlan.name_checkout, amount: findPlan.value_month, customer: customer.id})
    
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
});

const success = asyncHandler(async(req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.query.payment_intent);

    if (paymentIntent.status === 'succeeded') {
        const findData = await Checkout.findOneAndDelete({id_payment: req.query.payment_intent.split("_")[1]})

        if (findData) {
            const data = Date.now();
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const formater = new Intl.DateTimeFormat('pt-BR', options);
            const dataFormat = formater.format(data);

            var dataAtual = new Date();
            var day = dataAtual.getDate();
            var mes = dataAtual.getMonth() + 1;
            var ano = dataAtual.getFullYear()

            let plan;

            if (findData.plan == "plano-basico") {
                plan = "Basico"
            } else if (findData.plan == "plano-pro") {
                plan = "Pro"
            } else if (findData.plan == "plano-avancado") {
                plan = "Avançado"
            }

            const find = await User.findOne({email: findData.email.trim()})
            
            if (find) {
                const update = await User.findByIdAndUpdate(find._id, {name: `${findData.first_name.trim()} ${findData.last_name.trim()}`, cpf: findData.cpf, number: findData.number, email: findData.email, date: dataFormat, password: findData.password, customer: findData.customer, type_account: plan})
                const saveFinance = await Finances.create({idUser: update._id, value: findData.amount, day: day, month: mes, year: ano, email: findData.email, status: "Aprovado", plan: findData.type_account})
            } else {
                const newUser = await User.create({name: `${findData.first_name.trim()} ${findData.last_name.trim()}`, cpf: findData.cpf, number: findData.number, email: findData.email, date: dataFormat, password: findData.password, customer: findData.customer, type_account: plan})
                const saveFinance = await Finances.create({idUser: newUser._id, value: findData.amount, day: day, month: mes, year: ano, email: findData.email, status: "Aprovado", plan: findData.type_account})
            }
            
            let infos = {
                id: findData.id_payment,
                value: findData.amount,
                name: `${findData.first_name} ${findData.last_name}`,
                cpf: findData.cpf,
                date: dataFormat,
                plan: findData.type_account,
                email: findData.email,
                password: findData.password,
            }

            aprovedEmail(infos)

            res.render("layouts/success")
        } else {
            res.render("layouts/notFound")
        }
    } else {
        res.render("layouts/notFound")
    }
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})


// Validate informations

async function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

async function validatePhoneNumber(phoneNumber) {
  const phonePattern = /^\d{11}$/;
  return phonePattern.test(phoneNumber);
}

async function validateCPF(cpf) {
  const cleanedCPF = cpf.replace(/\D/g, '');

  if (cleanedCPF.length !== 11) {
    return false;
  }

  let sum = 0;
  let remainder;
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanedCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanedCPF.substring(9, 10))) {
    return false;
  }
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanedCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }
  if (remainder !== parseInt(cleanedCPF.substring(10, 11))) {
    return false;
  }

  return true;
}

const validateData = asyncHandler(async(req, res) => {
    try {
        const isEmailValid = await validateEmail(req?.body?.email);
        const isPhoneNumberValid = await validatePhoneNumber(req?.body?.phone);
        const isCPFValid = await validateCPF(req?.body?.cpf);
        
        if (isEmailValid && isPhoneNumberValid && isCPFValid) {
            return res.json({valid: true})
        } else {
            return res.json({valid: false})
        }
    } catch (err) {
        res.sendStatus(500)
    }
})

module.exports = 
{   checkout,
    success,
    createPayment,
    validateData
}
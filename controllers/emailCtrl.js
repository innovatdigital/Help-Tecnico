const fs = require('fs')
const nodemailer = require('nodemailer');
const axios = require('axios');
const moment = require('moment-timezone');
const ejs = require('ejs');
const dotenv = require('dotenv').config()
const path = require('path')

const smtpServer = 'smtp.gmail.com';
const smtpPort = 465;

async function welcomeCompany(data) {
    let transporter = nodemailer.createTransport({
        host: smtpServer,
        port: smtpPort,
        secure: true,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD_EMAIL
        }
    });

    const filePath = path.join(__dirname, '..', 'templates', 'company-welcome.ejs');
    const emailTemplate = fs.readFileSync(filePath, 'utf-8');

    const html = ejs.render(emailTemplate, data);

    let mailOptions = {
        from: '"Moreira Refrigeração" Plataforma Help Técnico',
        to: data.email,
        subject: `Seja bem vindo(a) ${data.name}`,
        text: 'Dados de acesso da plataforma.',
        html: html
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
    });
}

module.exports = {
    welcomeCompany
}
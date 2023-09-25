const asyncHandler = require('express-async-handler')
const Admin = require('../models/Admin')
const Technician = require('../models/Technician')
const Company = require('../models/Company')
const Suppliers = require('../models/Suppliers')
const Calls = require('../models/Calls')


// ########################## //
// ##       CHAMADOS       ## //
// ########################## //

const calls = asyncHandler(async(req, res) => {
    const calls = []

    for (const company of req.user.responsibleCompanies) {
        const foundCalls = await Calls.find({ id_company: company })

        for (const call of foundCalls) {
            const findCompany = await Company.findById(call.id_company)
    
            if (findCompany) {
                call.name_company = findCompany.name
                call.logo_company = findCompany.photo
            } else {
                call.name_company = "Empresa excluida"
                call.logo_company = ""
            }
        }
    
        calls.push(...foundCalls)
    }

    res.render('layouts/technician/calls', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, calls: calls.reverse()})
})

const viewCall = asyncHandler(async(req, res) => {
    const call = await Calls.findById(req.params.id)
    const findCompany = await Company.findById(call.id_company)

    call.emailCompany = findCompany.email
    call.phoneCompany = findCompany.phoneCompany
    call.photoCompany = findCompany.photo

    res.render('layouts/technician/view-call', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, call: call})
})





// ########################## //
// ##      RELATÓRIOS      ## //
// ########################## //

const reports = asyncHandler(async(req, res) => {
    const reports = [{
        _id: "6501f97cd7c07a0535820364",
        title: "Relatório de conclusão de serviço",
        imageCompany: "28730ff9-70c4-4270-898f-903dda65c5be-1694625282204-934505504.png",
        nameCompany: "Innovat Digital",
        type: "Conclusão de serviço",
        status: "Pendente",
        createdAt: "16/02/2023"
    }]

    res.render('layouts/technician/reports', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, reports: reports})
})

const viewReport = asyncHandler(async(req, res) => {
    res.render('layouts/technician/view-report', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})


const newEquipment = asyncHandler(async(req, res) => {
    const companies = await Company.find({})
    
    res.render('layouts/technician/register-equipment', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, companies: companies})
})

const saveEquipment = asyncHandler(async(req, res) => {
    const date = Date.now();
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formater = new Intl.DateTimeFormat('pt-BR', options);
    const dataFormat = formater.format(date);

    const id = await generateRandomString(20)

    const update = await Company.findByIdAndUpdate(req.params.id, {
        $push: {
            equipments: {
                id: id,
                photo: req.body.photo,
                model: req.body.model,
                brand: req.body.brand,
                date: dataFormat,
                maintenance: 0
            }
        }
    })

    if (update) {
        res.status(200).json({id: id})
    } else {
        res.sendStatus(500)
    }
})





// ######################### //
// ##       QR CODE       ## //
// ######################### //

const scanQrCode = asyncHandler(async(req, res) => {
    res.render('layouts/technician/scan-qr-code', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})





// ######################### //
// ##        CONTA        ## //
// ######################### //

const account = asyncHandler(async(req, res) => {
    res.render('layouts/technician/configurations', {user: req.user, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})

const updateAccount = asyncHandler(async(req, res) => {
    try {
        const update = await Technician.findByIdAndUpdate(req.user._id, req.body)

        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
})

const newPassword = asyncHandler(async(req, res) => {
    try {
        const technician = await Technician.findById(req.cookies._id)

        if (req.body.currentPassword === user.password && req.body.newPassword === req.body.confirmPassword) {
            const updatePassword = await Company.findByIdAndUpdate(req.cookies._id, {
                password: req.body.newPassword
            })

            if (updatePassword) {
                res.sendStatus(200)
            } else {
                res.sendStatus(500)
            }
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        res.sendStatus(500)
    }
})

module.exports = {
    calls,
    viewCall,

    reports,
    viewReport,

    scanQrCode,
    newEquipment,
    saveEquipment,
    account,
    updateAccount,
    newPassword
}
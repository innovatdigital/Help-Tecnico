const asyncHandler = require('express-async-handler')
const Admin = require('../models/Admin')
const Technician = require('../models/Technician')
const Company = require('../models/Company')
const Suppliers = require('../models/Suppliers')
const Calls = require('../models/Calls')


// ########################### //
// ##       DASHBOARD       ## //
// ########################### //

const dashboard = asyncHandler(async(req, res) => {
    const calls = await Calls.find({id_company: req.user._id})

    res.render('layouts/company/dashboard', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, calls: calls.reverse()})
})





// ########################## //
// ##       CHAMADOS       ## //
// ########################## //

const allCalls = asyncHandler(async(req, res) => {
    const calls = await Calls.find({id_company: req.user._id})

    res.render('layouts/company/all-calls', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, calls: calls.reverse()})
})

const newCall = asyncHandler(async(req, res) => {
    res.render('layouts/company/new-call', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, equipments: []})
})

const viewCall = asyncHandler(async(req, res) => {
    const call = await Calls.findById(req.params.id)

    call.emailCompany = req.user.email
    call.phoneCompany = req.user.phoneCompany
    call.photoCompany = req.user.photo

    res.render('layouts/company/view-call', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, call: call})
})

const saveCall = asyncHandler(async(req, res) => {
    try {
        const { description, photos } = req.body

        const date = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(date);

        const dateHour = new Date();

        const hour = dateHour.getHours();
        const minutes = dateHour.getMinutes();

        const saveCallInDb = await Calls.create({description: description, id_company: req.user._id, id_technician: '', photos: photos, date: dataFormat, status: "pending", sla: "0", timeline: [{text: `Chamado aberto por ${req.user.name}`, hour: `${hour}:${minutes}`, type: "company"}]})
        
        const saveCallInCompany = await Company.findByIdAndUpdate(
            { _id: req.user._id },
            {
                $push: {
                    calls: {
                        id: saveCallInDb._id
                    }
                }
            }
        );

        if (saveCallInCompany) {
            res.json({call: saveCallInDb._id})
        } else {
            res.sendStatus(500)
        }
    } catch (err) {
        res.sendStatus(500)
        console.log(err)
    }
})

const cancelCall = asyncHandler(async(req, res) => {
    const cancelCall = await Calls.findByIdAndUpdate(req.params.id, {cancellation_message: req.body.cancellation_message, status: "canceled"})

    if (cancelCall) {
        res.sendStatus(200)
    } else {
        res.sendStatus(500)
    }
})





// ########################## //
// ##         PMOC         ## //
// ########################## //

const viewPmoc = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-pmoc', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})





// ################################# //
// ##    LISTA DE EQUIPAMENTOS    ## //
// ################################# //

const viewEquipmentList = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-equipment-list', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})





// ########################## //
// ##     EQUIPAMENTOS     ## //
// ########################## //

const equipments = asyncHandler(async(req, res) => {
    const equipments = [{
        _id: "6501f97cd7c07a0535820364",
        image: "https://s.zst.com.br/cms-assets/2021/10/cuidados-com-o-ar-condicionado.jpg",
        model: "Ar condicionado Split",
        imageCompany: "28730ff9-70c4-4270-898f-903dda65c5be-1694625282204-934505504.png",
        nameCompany: "Innovat Digital",
        status: "Funcionando corretamente",
        maintances: 2,
        createdAt: "16/02/2023"
    }]

    res.render('layouts/company/equipments', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, equipments: equipments})
})

const viewEquipment = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-equipment', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})





// ########################## //
// ##      RELATÓRIOS      ## //
// ########################## //

const reports = asyncHandler(async(req, res) => {
    res.render('layouts/company/reports', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})

const viewReport = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-report', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})





// ########################## //
// ##      ORÇAMENTOS      ## //
// ########################## //

const budgets = asyncHandler(async(req, res) => {
    res.render('layouts/company/budgets', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})

const viewBudget = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-budget', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})





// ######################### //
// ##        CONTA        ## //
// ######################### //

const account = asyncHandler(async(req, res) => {
    res.render('layouts/company/configurations', {user: req.user, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})

const updateAccount = asyncHandler(async(req, res) => {
    try {
        const update = await Company.findByIdAndUpdate(req.user._id, {email: req?.body?.email})

        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
})

const newPassword = asyncHandler(async(req, res) => {
    try {
        const user = await Company.findById(req.cookies._id)

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
    dashboard,

    allCalls,
    newCall,
    viewCall,
    saveCall,
    cancelCall,

    equipments,
    viewEquipment,

    viewPmoc,

    viewEquipmentList,

    reports,
    viewReport,

    budgets,
    viewBudget,

    account,
    updateAccount,
    newPassword,
}
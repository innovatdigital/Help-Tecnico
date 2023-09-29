const asyncHandler = require('express-async-handler')
const Admin = require('../models/Admin')
const Technician = require('../models/Technician')
const Company = require('../models/Company')
const Suppliers = require('../models/Suppliers')
const Calls = require('../models/Calls')
const Equipments = require('../models/Equipments')
const moment = require('moment')


// ########################### //
// ##       DASHBOARD       ## //
// ########################### //

const dashboard = asyncHandler(async(req, res) => {
    const calls = await Calls.find({id_company: req.user._id})
    const equipments = await Equipments.find({idCompany: req.user._id}).count()

    for (const call of calls) {
        if (call.status != "pending" && call.id_technician.length > 0) {
            const findTechnician = await Technician.findById(call.id_technician)

            if (findTechnician) {
                call.name_technician = findTechnician.name
                call.photo_technician = findTechnician.photo
            }
        } else {
            call.photo_technician = ''
        }
    }

    res.render('layouts/company/dashboard', {photo: req.user.photo, name_user: req.user.name, service: req.user.service, calls: calls.reverse(), equipments: equipments})
})





// ########################## //
// ##       CHAMADOS       ## //
// ########################## //

const calls = asyncHandler(async(req, res) => {
    const calls = await Calls.find({id_company: req.user._id})

    for (const call of calls) {
        if (call.status != "pending" && call.id_technician.length > 0) {
            const findTechnician = await Technician.findById(call.id_technician)

            if (findTechnician) {
                call.name_technician = findTechnician.name
                call.photo_technician = findTechnician.photo
            }
        } else {
            call.photo_technician = ''
        }
    }

    res.render('layouts/company/calls', {photo: req.user.photo, name_user: req.user.name, service: req.user.service, calls: calls.reverse()})
})

const newCall = asyncHandler(async(req, res) => {
    const equipments = await Equipments.find({idCompany: req.user._id})
    
    for (const equipment of equipments) {
        const dateCreatedAt = moment.utc(equipment.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");
    
        equipment.createdAtFormatted = createdAtFormatted
    }

    res.render('layouts/company/new-call', {photo: req.user.photo, name_user: req.user.name, service: req.user.service, equipments: equipments})
})

const viewCall = asyncHandler(async(req, res) => {
    const call = await Calls.findById(req.params.id)
    const equipments = []
    
    for (const equipment of call.equipments) {
        const findEquipment = await Equipments.findById(equipment)

        equipments.push(findEquipment)
    }

    call.emailCompany = req.user.email
    call.phoneCompany = req.user.phoneCompany
    call.photoCompany = req.user.photo

    res.render('layouts/company/view-call', {isAdmin: true, notifications: req.user.notifications.reverse(), photo: req.user.photo, name_user: req.user.name, service: req.user.service, call: call, equipments: equipments})
})

const saveCall = asyncHandler(async(req, res) => {
    try {
        const { description, photos, equipments } = req.body

        const date = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(date);

        const dateHour = new Date();

        const hour = dateHour.getHours();
        const minutes = dateHour.getMinutes();

        const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000);

        const saveCallInDb = await Calls.create({description: description, id_company: req.user._id, id_technician: '', photos: photos, equipments: equipments, code: code, date: dataFormat, status: "pending", sla: "0", timeline: [{text: `Chamado aberto por ${req.user.name}`, hour: `${hour}:${minutes}`, type: "company"}]})
        
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
    res.render('layouts/company/view-pmoc', {photo: req.user.photo, name_user: req.user.name, service: req.user.service})
})





// ################################# //
// ##    LISTA DE EQUIPAMENTOS    ## //
// ################################# //

const viewEquipmentList = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-equipment-list', {photo: req.user.photo, name_user: req.user.name, service: req.user.service})
})





// ########################## //
// ##     EQUIPAMENTOS     ## //
// ########################## //

const equipments = asyncHandler(async(req, res) => {
    const equipments = await Equipments.find({idCompany: req.user._id})
    
    for (const equipment of equipments) {
        const dateCreatedAt = moment.utc(equipment.createdAt);
        const createdAtFormatted = dateCreatedAt.format("DD/MM/YYYY");
    
        equipment.createdAtFormatted = createdAtFormatted
    }

    res.render('layouts/company/equipments', {photo: req.user.photo, name_user: req.user.name, service: req.user.service, equipments: equipments})
})

const viewEquipment = asyncHandler(async(req, res) => {
    const equipment = await Equipments.findById(req.params.id)

    res.render('layouts/company/view-equipment', {photo: req.user.photo, name_user: req.user.name, service: req.user.service, equipment: equipment})
})





// ########################## //
// ##      RELATÓRIOS      ## //
// ########################## //

const reports = asyncHandler(async(req, res) => {
    res.render('layouts/company/reports', {photo: req.user.photo, name_user: req.user.name, service: service})
})

const viewReport = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-report', {photo: req.user.photo, name_user: req.user.name, service: service})
})





// ########################## //
// ##      ORÇAMENTOS      ## //
// ########################## //

const budgets = asyncHandler(async(req, res) => {
    res.render('layouts/company/budgets', {photo: req.user.photo, name_user: req.user.name, service: service})
})

const viewBudget = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-budget', {photo: req.user.photo, name_user: req.user.name, service: service})
})





// ######################### //
// ##        CONTA        ## //
// ######################### //

const account = asyncHandler(async(req, res) => {
    res.render('layouts/company/account', {user: req.user, photo: req.user.photo, name_user: req.user.name, service: req.user.service})
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

    calls,
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
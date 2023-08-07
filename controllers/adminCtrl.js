const asyncHandler = require('express-async-handler')
const Admin = require('../models/Admin')
const Report = require('../models/Report')
const Technician = require('../models/Technician')
const Company = require('../models/Company')
const Suppliers = require('../models/Suppliers')
const Calls = require('../models/Calls')

const dashboard = asyncHandler(async(req, res) => {
    const calls = await Calls.find({})

    res.render('layouts/admin/dashboard', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, calls: calls.reverse()})
})

const allCalls = asyncHandler(async(req, res) => {
    const calls = await Calls.find({})
    const callsObject = []

    await Promise.all(calls.map(async call => {
        const company = await Company.findById(call.id_company);
    
        call.nameCompany = company.name;
        call.imageCompany = company.photo;
    
        callsObject.push(call);
    }));

    res.render('layouts/admin/all-calls', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, calls: callsObject.reverse()})
})

const allReports = asyncHandler(async(req, res) => {
    res.render('layouts/admin/all-reports', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})

const administrators = asyncHandler(async(req, res) => {
    const findAdmins = await Admin.find({})

    res.render('layouts/admin/administrators', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, administrators: findAdmins})
})

const technicians = asyncHandler(async(req, res) => {
    const findTechnicians = await Technician.find({})

    res.render('layouts/admin/technicians', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, technicians: findTechnicians})
})

const viewCall = asyncHandler(async(req, res) => {
    const call = await Calls.findById(req.params.id)
    const company = await Company.findById(call.id_company)

    call.emailCompany = req.user.email
    call.phoneCompany = req.user.phoneCompany
    call.photoCompany = company.photo

    res.render('layouts/admin/view-call', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, call: call})
})

const allCompanies = asyncHandler(async(req, res) => {
    const companies = await Company.find({})

    res.render('layouts/admin/all-companies', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, companies: companies.reverse()})
})

const allSuppliers = asyncHandler(async(req, res) => {
    const suppliers = await Suppliers.find({})

    res.render('layouts/admin/all-suppliers', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, suppliers: suppliers.reverse()})
})

const invoices = asyncHandler(async(req, res) => {
    res.render('layouts/admin/invoices', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})

const newTechnician = asyncHandler(async(req, res) => {
    res.render('layouts/admin/newTechnician', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
})

const saveTechnician = asyncHandler(async(req, res) => {
    try {
        const data = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(data);

        req.body.date = dataFormat

        const save = await Technician.create(req.body)

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

const newCompany = asyncHandler(async(req, res) => {
    res.render('layouts/admin/newCompany', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
})

const saveCompany = asyncHandler(async(req, res) => {
    try {
        if (req.params.id === undefined) {
            const data = Date.now();
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const formater = new Intl.DateTimeFormat('pt-BR', options);
            const dataFormat = formater.format(data);

            req.body.date = dataFormat

            const save = await Company.create(req.body)
        } else {
            const save = await Company.findByIdAndUpdate(req.params.id, req.body)
        }

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

const viewCompany = asyncHandler(async(req, res) => {
    const infosCompany = await Company.findById(req.params.id)

    if (infosCompany) {
        res.render('layouts/admin/viewCompany', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, company: infosCompany })
    } else {
        res.render('layouts/admin/404')
    }
})

const updateCompany = asyncHandler(async(req, res) => {
    const infosCompany = await Company.findById(req.params.id)

    if (infosCompany) {
        res.render('layouts/admin/editCompany', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, company: infosCompany })
    } else {
        res.render('layouts/admin/404')
    }
})

const deleteCompany = asyncHandler(async(req, res) => {
    try {
        const delCompany = await Company.findByIdAndDelete(req.params.id)

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

const newSupplier = asyncHandler(async(req, res) => {
    res.render('layouts/admin/newSupplier', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
})

const saveSupplier = asyncHandler(async(req, res) => {
    try {
        if (req.params.id === undefined) {
            const data = Date.now();
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            const formater = new Intl.DateTimeFormat('pt-BR', options);
            const dataFormat = formater.format(data);

            req.body.date = dataFormat

            const save = await Suppliers.create(req.body)
        } else {
            const save = await Suppliers.findByIdAndUpdate(req.params.id, req.body)
        }

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

const viewSupplier = asyncHandler(async(req, res) => {
    const infosSupplier = await Suppliers.findById(req.params.id)

    if (infosSupplier) {
        res.render('layouts/admin/viewSupplier', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, supplier: infosSupplier })
    } else {
        res.render('layouts/admin/404')
    }
})

const updateSupplier = asyncHandler(async(req, res) => {
    const infosSupplier = await Suppliers.findById(req.params.id)

    if (infosSupplier) {
        res.render('layouts/admin/editSupplier', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, supplier: infosSupplier })
    } else {
        res.render('layouts/admin/404')
    }
})

const deleteSupplier = asyncHandler(async(req, res) => {
    try {
        const delSupplier = await Suppliers.findByIdAndDelete(req.params.id)

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


const newAdmin = asyncHandler(async(req, res) => {
    res.render('layouts/admin/newAdmin', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
})

const saveAdmin = asyncHandler(async(req, res) => {
    try {
        const data = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(data);

        req.body.date = dataFormat

        const save = await Admin.create(req.body)

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

const newTest = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    res.render('layouts/admin/newTest', { isAdmin: true, notifications: find.notifications.reverse().slice(0, 5), photo: find.photo, name_user: find.name })
})

module.exports = {
    dashboard,
    administrators,
    allCalls,
    allReports,
    technicians,
    viewCall,
    allCompanies,
    allSuppliers,
    newTechnician,
    newCompany,
    newAdmin,
    newSupplier,
    viewSupplier,
    updateSupplier,
    deleteSupplier,
    saveSupplier,
    saveTechnician,
    saveCompany,
    deleteCompany,
    viewCompany,
    saveAdmin,
    updateCompany,
    newTest,
    invoices
}
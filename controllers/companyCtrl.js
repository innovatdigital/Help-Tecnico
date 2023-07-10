const asyncHandler = require('express-async-handler')
const Admin = require('../models/Admin')
const Technician = require('../models/Technician')
const Company = require('../models/Company')
const Suppliers = require('../models/Suppliers')
const Calls = require('../models/Calls')

const dashboard = asyncHandler(async(req, res) => {
    const calls = await Calls.find({})

    res.render('layouts/company/dashboard', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, calls: calls.reverse()})
})

const allCalls = asyncHandler(async(req, res) => {
    const calls = await Calls.find({})

    res.render('layouts/company/all-calls', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, calls: calls.reverse()})
})

const newCall = asyncHandler(async(req, res) => {
    res.render('layouts/company/new-call', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})

const viewCall = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-call', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})

const viewEquipment = asyncHandler(async(req, res) => {
    res.render('layouts/company/view-equipment', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})

const notifications = asyncHandler(async(req, res) => {
    res.render('layouts/company/notifications', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})

const myEquipments = asyncHandler(async(req, res) => {
    res.render('layouts/company/my-equipments', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})

const reports = asyncHandler(async(req, res) => {
    res.render('layouts/company/reports', {notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name})
})

const allCompanies = asyncHandler(async(req, res) => {
    const companies = await Company.find({})

    res.render('layouts/company/all-companies', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, companies: companies.reverse()})
})

const allSuppliers = asyncHandler(async(req, res) => {
    const suppliers = await Suppliers.find({})

    res.render('layouts/company/all-suppliers', {isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, suppliers: suppliers.reverse()})
})

const newTechnician = asyncHandler(async(req, res) => {
    res.render('layouts/company/newTechnician', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
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
    res.render('layouts/company/newCompany', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
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
        res.render('layouts/company/viewCompany', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, company: infosCompany })
    } else {
        res.render('layouts/company/404')
    }
})

const updateCompany = asyncHandler(async(req, res) => {
    const infosCompany = await Company.findById(req.params.id)

    if (infosCompany) {
        res.render('layouts/company/editCompany', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, company: infosCompany })
    } else {
        res.render('layouts/company/404')
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
    res.render('layouts/company/newSupplier', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
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
        res.render('layouts/company/viewSupplier', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, supplier: infosSupplier })
    } else {
        res.render('layouts/company/404')
    }
})

const updateSupplier = asyncHandler(async(req, res) => {
    const infosSupplier = await Suppliers.findById(req.params.id)

    if (infosSupplier) {
        res.render('layouts/company/editSupplier', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name, supplier: infosSupplier })
    } else {
        res.render('layouts/company/404')
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
    res.render('layouts/company/newAdmin', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
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

    res.render('layouts/company/newTest', { isAdmin: true, notifications: find.notifications.reverse().slice(0, 5), photo: find.photo, name_user: find.name })
})


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

const notificationsEmail = asyncHandler(async(req, res) => {
    try {
        const user = await User.findById(req.cookies._id)
        
        if (user) {
            if (req.body.status == true || req.body.status == false) {
                const updateNotification = await User.findByIdAndUpdate(req.cookies._id, {
                    notificationEmail: req.body.status
                })
    
                if (updateNotification) {
                    res.sendStatus(200)
                } else {
                    res.sendStatus(500)
                }
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
    allCompanies,
    allSuppliers,
    newTechnician,
    newCall,
    newCompany,
    newAdmin,
    myEquipments,
    newSupplier,
    viewSupplier,
    reports,
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
    account,
    updateAccount,
    newPassword,
    viewCall,
    viewEquipment,
    notifications,
    notificationsEmail
}
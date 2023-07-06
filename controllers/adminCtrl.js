const asyncHandler = require('express-async-handler')
const Admin = require('../models/Admin')
const Technician = require('../models/Technician')
const Company = require('../models/Company')
const Suppliers = require('../models/Suppliers')
const Calls = require('../models/Calls')

const dashboard = asyncHandler(async(req, res) => {
    const find = await Admin.findById(req.user._id)
    const calls = await Calls.find({})

    res.render('layouts/dashboard', {isAdmin: find.isAdmin, notifications: find.notifications.reverse().slice(0, 5), photo: find.photo, name_user: find.name, calls: calls.reverse()})
})

const users = asyncHandler(async(req, res) => {
    const users = await User.find({}).lean().select("_id name email isAdmin isBloqued photo type_account")
    const find = await User.findById(req.cookies._id)

    res.render('layouts/users', { isAdmin: true, users: users, notifications: find.notifications.reverse().slice(0, 5), photo: find.photo, name_user: find.name })
})

const newUser = asyncHandler(async(req, res) => {
    try {
        const data = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(data);

        var dataAtual = new Date();
        var day = dataAtual.getDate();
        var mes = dataAtual.getMonth() + 1;
        var ano = dataAtual.getFullYear()

        const newUser = await User.create({name: req.body.name, cpf: req.body.cpf, number: req.body.number, email: req.body.email, date: dataFormat, password: req.body.password, type_account: req.body.type_account, isAdmin: req.body.admin})
        const saveFinance = await Finances.create({idUser: newUser._id, value: req.body.value, day: day, month: mes, year: ano, email: req.body.email, status: "Aprovado", plan: req.body.type_account})

        res.sendStatus(200)
    } catch (err) {
        res.send(err)
    }
})

const newTechnician = asyncHandler(async(req, res) => {
    res.render('layouts/newTechnician', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
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
    res.render('layouts/newCompany', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
})

const saveCompany = asyncHandler(async(req, res) => {
    try {
        const data = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(data);

        req.body.date = dataFormat

        const save = await Company.create(req.body)

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

const newSupplier = asyncHandler(async(req, res) => {
    res.render('layouts/newSupplier', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
})

const saveSupplier = asyncHandler(async(req, res) => {
    try {
        const data = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(data);

        req.body.date = dataFormat

        const save = await Suppliers.create(req.body)

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

const newAdmin = asyncHandler(async(req, res) => {
    res.render('layouts/newAdmin', { isAdmin: true, notifications: req.user.notifications.reverse().slice(0, 5), photo: req.user.photo, name_user: req.user.name })
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

    res.render('layouts/newTest', { isAdmin: true, notifications: find.notifications.reverse().slice(0, 5), photo: find.photo, name_user: find.name })
})

const infoUser = asyncHandler(async(req, res) => {
    const find = await User.findById(req.params.id)

    res.render('layouts/infoUser', { isAdmin: true, find: find, notifications: find.notifications.reverse().slice(0, 5), photo: find.photo, name_user: find.name })
})

const updateUser = asyncHandler(async(req, res) => {
    try {
        const update = await User.findByIdAndUpdate(req.params.id, {name: req.body.name, cpf: req.body.cpf, number: req.body.number, email: req.body.email, password: req.body.password, type_account: req.body.type_account, isAdmin: req.body.admin})

        res.sendStatus(200)
    } catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

const blockUser = asyncHandler(async(req, res) => {
    try {
        const id_user = req.params.id

        const block = await User.findByIdAndUpdate({_id: id_user}, {
            "isBloqued": true
        })

        res.sendStatus(200)
    } catch (err) {
        res.send(err)
    }
})

const unlockUser = asyncHandler(async(req, res) => {
    try {
        const id_user = req.params.id

        const block = await User.findByIdAndUpdate({_id: id_user}, {
            "isBloqued": false
        })

        res.sendStatus(200)
    } catch (err) {
        res.send(err)
    }
})

const deleteUser = asyncHandler(async(req, res) => {
    try {
        const id_user = req.params.id

        const delUser = await User.findByIdAndDelete(id_user)

        res.sendStatus(200)
    } catch (err) {
        res.send(err)
    }
})

module.exports = {
    dashboard,
    users,
    newTechnician,
    newCompany,
    infoUser,
    newAdmin,
    newSupplier,
    saveSupplier,
    saveTechnician,
    saveCompany,
    saveAdmin,
    updateUser,
    blockUser,
    unlockUser,
    deleteUser,
    newTest
}
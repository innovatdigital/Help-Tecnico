const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Plans = require('../models/Plans')
const Feedbacks = require('../models/Feedbacks')
const Finances = require('../models/Finances')

const feedbacks = asyncHandler(async(req, res) => {
    const getFeedbacks = await Feedbacks.find({}).lean()
    const find = await User.findById(req.cookies._id)

    res.render('layouts/feedbacks', { isAdmin: true, feedbacks: getFeedbacks, notifications: find.notifications.reverse().slice(0, 5) })
})

const users = asyncHandler(async(req, res) => {
    const users = await User.find({}).lean()
    const find = await User.findById(req.cookies._id)

    res.render('layouts/users', { isAdmin: true, users: users, notifications: find.notifications.reverse().slice(0, 5) })
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

const newUserPage = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    res.render('layouts/new_user', { isAdmin: true, notifications: find.notifications.reverse().slice(0, 5) })
})

const infoUser = asyncHandler(async(req, res) => {
    const find = await User.findById(req.params.id)

    res.render('layouts/info_user', { isAdmin: true, find: find, notifications: find.notifications.reverse().slice(0, 5) })
})

const updateUser = asyncHandler(async(req, res) => {
    try {
        const update = await User.findByIdAndUpdate(req.params.id, {name: req.body.name, cpf: req.body.cpf, number: req.body.number, email: req.body.email, password: req.body.password, type_account: req.body.type_account, isAdmin: req.body.admin, notifications: find.notifications.reverse().slice(0, 5)})

        res.sendStatus(200)
    } catch (err) {
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

const plans = asyncHandler(async(req, res) => {
    const plans = await Plans.find({}).lean()
    const find = await User.findById(req.cookies._id)

    res.render('layouts/plans', { isAdmin: true, plans: plans, notifications: find.notifications.reverse().slice(0, 5) })
})

const newPlan = asyncHandler(async(req, res) => {
    const plans = await Plans.create(req.body)

    res.send(200)
})

const finance = asyncHandler(async(req, res) => {
    const finance = await Finances.find({}).lean()
    const find = await User.findById(req.cookies._id)

    valueTotal = 0

    finance.forEach((value) => {
        valueTotal = valueTotal + value.value
    })

    res.render('layouts/finance', { isAdmin: true, finance: finance, valueTotal: valueTotal, notifications: find.notifications.reverse().slice(0, 5) })
})

const emails = asyncHandler(async(req, res) => {
    res.render('layouts/emails', { isAdmin: true })
})

module.exports = {
    feedbacks,
    users,
    newUser,
    newUserPage,
    infoUser,
    updateUser,
    blockUser,
    unlockUser,
    deleteUser,
    plans,
    newPlan,
    finance,
    emails
}
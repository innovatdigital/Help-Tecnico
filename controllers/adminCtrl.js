const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Plans = require('../models/Plans')
const Feedbacks = require('../models/Feedbacks')
const Finances = require('../models/Finances')
const bcrypt = require('bcrypt')

const feedbacks = asyncHandler(async(req, res) => {
    const getFeedbacks = await Feedbacks.find({}).lean()

    res.render('layouts/feedbacks', { isAdmin: "true", feedbacks: getFeedbacks })
})

const users = asyncHandler(async(req, res) => {
    const users = await User.find({}).lean()

    res.render('layouts/users', { isAdmin: "true", users: users })
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

    res.render('layouts/plans', { isAdmin: "true", plans: plans })
})

const newPlan = asyncHandler(async(req, res) => {
    const plans = await Plans.create(req.body)

    res.send(200)
})

const finance = asyncHandler(async(req, res) => {
    const finance = await Finances.find({}).lean()

    res.render('layouts/finance', { isAdmin: "true", finance: finance })
})

const emails = asyncHandler(async(req, res) => {
    res.render('layouts/emails', { isAdmin: "true" })
})

module.exports = {
    feedbacks,
    users,
    blockUser,
    unlockUser,
    deleteUser,
    plans,
    newPlan,
    finance,
    emails
}
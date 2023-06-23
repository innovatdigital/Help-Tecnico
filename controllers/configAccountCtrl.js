const asyncHandler = require('express-async-handler')
const User = require('../models/User')

const configurations = asyncHandler(async(req, res) => {
    const find = await User.findById(req.cookies._id)

    res.render('layouts/configurations', {isAdmin: find.isAdmin, user: find, notifications: find.notifications.reverse().slice(0, 5), photo: find.photo, name_user: find.name})
})

const updateAccount = asyncHandler(async(req, res) => {
    try {
        const update = await User.findByIdAndUpdate(req.cookies._id, {name: req?.body?.name, cpf: req?.body?.cpf, number: req?.body?.number, email: req?.body?.email, password: req?.body?.password})

        res.sendStatus(200)
    } catch (err) {
        res.sendStatus(500)
    }
})

const newPassword = asyncHandler(async(req, res) => {
    try {
        const user = await User.findById(req.cookies._id)

        if (req.body.currentPassword === user.password && req.body.newPassword === req.body.confirmPassword) {
            const updatePassword = await User.findByIdAndUpdate(req.cookies._id, {
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


module.exports = 
{   
    configurations,
    updateAccount,
    newPassword,
    notificationsEmail
}
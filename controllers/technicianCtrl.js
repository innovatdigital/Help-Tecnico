const asyncHandler = require('express-async-handler')
const Admin = require('../models/Admin')
const Technician = require('../models/Technician')
const Company = require('../models/Company')
const Suppliers = require('../models/Suppliers')
const Calls = require('../models/Calls')

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
    scanQrCode,
    newEquipment,
    saveEquipment,
    account,
    updateAccount,
    newPassword
}
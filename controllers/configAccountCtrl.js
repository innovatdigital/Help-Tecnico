const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const bcrypt = require('bcrypt');
const fbgraph = require('fbgraph');
const fb = require('fb');

const config = asyncHandler(async(req, res) => {
    const find = await User.findOne({email: "admin"}).lean()

    const accounts = []

    find.accountsFb.forEach(account => {
        accounts.push(account)
    })

    find.accountsIg.forEach(account => {
        accounts.push(account)
    })

    if (find.isAdmin == "true") {
        res.render('layouts/config', {isAdmin: true, user: find})
    } else {
        res.render('layouts/config', {isAdmin: false, user: find})
    }
})

module.exports = 
{   config,
}
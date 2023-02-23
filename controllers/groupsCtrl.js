const asyncHandler = require('express-async-handler')
const User = require('../models/User')

// Funcionalities // Trocar por buscar no accounts

const groups = asyncHandler(async(req, res) => {
    const findGroups = await User.findById({_id: req.cookies._id})

    res.render('layouts/groups', { isAdmin: false, accounts: findGroups.accountsFb })
})

const groupsFilter = asyncHandler(async(req, res) => {
    const id_account = req.params.id_account

    console.log(req.params)

    const findGroups = await User.findById({_id: req.cookies._id, accountsFb: Array})
    const targetAccount = findGroups.accountsFb.find(account => account.id_account == id_account);

    res.render('layouts/groupsFilter', { isAdmin: false, accounts: findGroups.accountsFb, account: targetAccount.groups })
})

module.exports = 
{   groups,
    groupsFilter
}
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const checkTypeAccount = asyncHandler(async(req, res, next) => {
    try {
        const findTypeAccount = await User.findOne({email: "admin"})

        if (findTypeAccount.type_account == "Basico") {
            const find = await User.findOne({name: 'vvagner', accountsFb: Array})
            const count = find.accountsFb.length

            if (count >= 1) {
                res.send('Não é possível adicionar mais que uma conta no seu plano. Faça upgrade.')
            } else {
                next()
            }

        } else if(findTypeAccount.type_account == "Pro") {
            const find = await User.findOne({name: 'vvagner', accountsFb: Array})
            const count = find.accountsFb.length

            if (count >= 10) {
                res.send('Para adicionar mais contas faça upgrade do seu plano.')
            } else {
                next()
            }
        } else if (findTypeAccount.type_account == "Avançado") {
            next()
        }
    } catch (err) {
        res.send(err)
    }
})

module.exports = {checkTypeAccount}
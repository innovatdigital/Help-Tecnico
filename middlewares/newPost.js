const User = require('../models/User')
const asyncHandler = require('express-async-handler')

const checkPost = asyncHandler(async(req, res, next) => {
    try {
        const findTypeAccount = await User.findById(req.cookies._id)

        if (findTypeAccount.type_account == "Basico") {
            const count = findTypeAccount.accountsFb.length

            if (count > 5) {
                res.send('Não é possível adicionar mais que uma conta no seu plano. Faça upgrade.')
            } else {
                next()
            }

        } else if (findTypeAccount.type_account == "Pro") {
            const count = findTypeAccount.accountsFb.length

            if (count > 15) {
                res.send('Para adicionar mais contas faça upgrade do seu plano.')
            } else {
                next()
            }
        } else if (findTypeAccount.type_account == "Avançado") {
            const count = findTypeAccount.accountsFb.length

            if (count > 30) {
                res.send('Limite excedido.')
            } else {
                next()
            }
        }
    } catch (err) {
        res.send(err)
    }
})

module.exports = {checkTypeAccount}
const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Historic = require('../models/Historic')

const historic = asyncHandler(async(req, res) => {
    const historic = await Historic.find({id_user: req.cookies._id})

    res.render('layouts/historic', {isAdmin: false, historic: historic})
})

module.exports = 
{   historic,
}
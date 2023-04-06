const express = require('express')
const Plans = require('../models/Plans')
const router = express.Router()

router.get("/", async(req, res) => {
    const plans = await Plans.find({})
    
    res.render('layouts/main', { plans: plans })
})

router.get("/policy", async(req, res) => {
    res.render('layouts/policy')
})

module.exports = router
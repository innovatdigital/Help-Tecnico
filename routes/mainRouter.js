const express = require('express')
const router = express.Router()

router.get("/", async(req, res) => {
    res.render('layouts/main/index.ejs')
})

router.get("/privacy-policy", async(req, res) => {
    res.render('layouts/main/privacy-policy')
})

router.get("/cookies-policy", async(req, res) => {
    res.render('layouts/main/cookies-policy')
})

module.exports = router
const express = require('express')
const router = express.Router()

const { 
    page,
    login
} = require('../controllers/authCtrl')

router.get("/", page)
router.post("/handle-login", login)

module.exports = router
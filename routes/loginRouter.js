const express = require('express')
const router = express.Router()
const { 
    Page,
    Login,
    Register
} = require('../controllers/loginCtrl')

const {
    checkLogin
} = require('../middlewares/checkLogin')


router.get("/", checkLogin, Page)
router.post("/auth", Login)
router.post("/register", Register)

module.exports = router
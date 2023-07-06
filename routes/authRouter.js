const express = require('express')
const router = express.Router()
const { 
    Page,
    Login,
    logout
} = require('../controllers/authCtrl')

const {
    authMiddleware
} = require('../middlewares/authMiddleware')


router.get("/", Page)
router.post("/auth", Login)
router.get("/logout", logout)

module.exports = router
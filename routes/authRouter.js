const express = require('express')
const router = express.Router()
const { 
    login,
    handleLogin,
    forgotPassword,
    sendToken,
    validPasswordToken,
    resetPassword
} = require('../controllers/authCtrl')


router.get("/", login)

router.get("/forgot-password", forgotPassword)
router.post("/forgot-password/send-token", sendToken)
router.get("/forgot-password/:token", validPasswordToken)
router.post("/reset-password/:token", resetPassword)

router.post("/handle-login", handleLogin)

module.exports = router
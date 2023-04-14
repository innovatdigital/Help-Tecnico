const express = require('express')
const router = express.Router()

const {
    checkout,
    checkUser,
    processPayment
} = require('../controllers/checkoutCtrl')

router.get("/:id", checkout)
router.post("/check_user", checkUser)
router.post("/process_payment", processPayment)

module.exports = router
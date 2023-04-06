const express = require('express')
const router = express.Router()

const {
    checkout,
    processPayment,
    processPaymentTest
} = require('../controllers/checkoutCtrl')

router.get("/:id", checkout)
router.post("/process_payment", processPayment)
router.post("/process_payment_", processPaymentTest)

module.exports = router
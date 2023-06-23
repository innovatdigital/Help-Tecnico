const express = require('express')
const router = express.Router()

const {
    checkout,
    success,
    createPayment,
    validateData,
} = require('../controllers/checkoutCtrl')

router.get("/payment/:name_checkout", checkout)
router.get("/success", success)
router.post("/validate-data", validateData)
router.post("/create-payment-intent/:name_checkout", createPayment)

module.exports = router
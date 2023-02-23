const express = require('express')
const router = express.Router()

const {
    checkout,
    processPayment
} = require('../controllers/checkoutCtrl')

router.get("/:id", checkout)
router.post("/process_payment", processPayment)

module.exports = router
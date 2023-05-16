const express = require('express')
const Access = require('../models/Access')
const Plans = require('../models/Plans')
const axios = require('axios');
const ip = require('ip');
const geoip = require('geoip-lite');
const router = express.Router()

router.get("/", async(req, res) => {
    const plans = await Plans.find({})

    try {
        const location = geoip.lookup(ip.address());
        const data = Date.now();
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const formater = new Intl.DateTimeFormat('pt-BR', options);
        const dataFormat = formater.format(data);
        
        if (location != null) {
            const access = await Access.create({country: location?.country, region: location?.region, city: location?.city, ll: location?.ll, date: dataFormat})
        } else {
            const access = await Access.create({country: 'undefined', region: 'undefined', city: 'undefined', ll: 'undefined', date: dataFormat})
        }
    
        res.render('layouts/main', { plans: plans })
    } catch (err) {
        res.render('layouts/main', { plans: plans })
    }
})

router.get("/policy", async(req, res) => {
    res.render('layouts/policy')
})

module.exports = router
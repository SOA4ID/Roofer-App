const express = require('express');
const Device = require('../models/Device');
const router = express.Router();

router.get('/',  async (req, res) => {
    try {
        const devices = await Device.find();
        res.json(devices);
    } catch (err) {
        res.json({message: err});
    }
});

router.post('/', async (req,res) => {

    const device = new Device({
        unitNumber: req.body.unitNumber,
        name: req.body.name,

    });

    try {
        const savedDevice = await device.save();
        res.json({message: 'Device registered'});
    } catch (err) {
        res.json({message: err});
    }
});

router.post('/pair', async (req,res) => {

    const oldVal = await Device.findOne({unitNumber: req.body.unitNumber});

    const device = new Device({
        unitNumber: oldVal.unitNumber,
        name: oldVal.name,
        owner: req.body.owner,

    });

    try {
        await Device.deleteOne({unitNumber: req.body.unitNumber});
        await device.save();
        res.json({message: 'paired'});
    } catch (err) {
        res.json({message: err});
    }
});

module.exports = router;
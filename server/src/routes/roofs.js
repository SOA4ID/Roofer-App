const express = require('express');
const Roof = require('../models/Roof');

const router = express.Router();

router.get('/',  async (req, res) => {
    try {
        const roofs = await Roof.find({device: req.body.device});
        res.json(roofs);
    } catch (err) {
        res.json({message: err});
    }
});

router.post('/', async (req,res) => {

    const roof = new Roof({
        unitNumber: req.body.unitNumber,
        name: req.body.name,
        device: req.body.device,
        actionCmd: req.body.actionCmd,
        autoOnCmd: req.body.autoOnCmd,
        autoOffCmd: req.body.autoOffCmd
    });

    try {
        const savedRoof = await roof.save();
        res.json({message: 'Accepted'});
    } catch (err) {
        res.json({message: err});
    }
});

module.exports = router;
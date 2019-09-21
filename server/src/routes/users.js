const express = require('express');
const User = require('../models/User');
const Device = require('../models/Device');
const Roof = require('../models/Roof');

const router = express.Router();

router.get('/',  async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({message: err});
    }
});

router.post('/login',  async (req, res) => {
    const user = await User.findOne({username: req.body.username});

    // Verify if username exists
    if (user === null) {
        res.json({message: 'Username does not exist'});
        return
    }

    // Verify if password was inserted correctly
    if (user.password !== req.body.password) {
        res.json({message: 'Password does not match username'});
        return
    } else {
        res.json({message: 'LoggedIn'});
    }

    
});

router.post('/roofs',  async (req, res) => {
    try {
        const device = await Device.findOne({owner: req.body.username});
        const roofs = await Roof.find({device: device.unitNumber});
        res.json({status: 'success' , message: roofs});
    } catch (err) {
        res.json({status: 'failed' , message: err});
    }
});

router.post('/', async (req,res) => {

    const userNameExists = await User.findOne({username: req.body.username});
    const emailExists = await User.findOne({email: req.body.email});

    // Verify username doesn't already exist
    if (userNameExists !== null) {
        res.json({message: 'Username already exists'});
        return
    }

    // Verify email isn't already in use
    if (emailExists !== null) {
        res.json({message: 'Email already in use'});
        return
    }

    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });

    try {
        const savedUser = await user.save();
        res.json({message: 'Accepted'});
    } catch (err) {
        res.json({message: err});
    }
});

module.exports = router;
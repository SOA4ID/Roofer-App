const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

require('dotenv/config');

// Import Routes
const usersRoute = require('./routes/users');
const roofRoute = require('./routes/roofs');
const deviceRoute = require('./routes/devices');

// MiddleWare
app.use(bodyParser.json());
app.use('/users', usersRoute);
app.use('/roofs', roofRoute);
app.use('/devices', deviceRoute);

// ROUTES
app.get('/', (req, res) => {
    res.send('We are on home');
});

// connect to DB
mongoose.connect( process.env.DB_CONNECTION,
                { useNewUrlParser: true },
                () => console.log('Connected to MongoDB')
);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);
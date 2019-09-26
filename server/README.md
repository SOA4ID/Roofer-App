# Server

## About

Technologies implemented:

- [Express Server](https://expressjs.com/)
- [Heroku](https://www.heroku.com/)
- [Mongo DB - Atlas](https://www.mongodb.com/cloud/atlas)

## Installation

```bash
git clone https://github.com/SOA4ID/Roofer-App.git
cd /Roofer-App/server
npm install
```

## Running the Server

This server is already hosted and running online. If you however, wish to run it locally, simply open a terminal from within the /server directory and type:

```bash
npm start
```

> **Important:** For security reasons, the DataBase connection string has been excluded. In order to stablish a connection, a `.env` file must be created inside the `/server` directory, and simply add `DB_CONNECTION= mongodb+srv://user:password@cluster.mongodb.net/test?retryWrites=true&w=majority`. Where `user` is your data base username, `password` is the password for said user, and `cluster` is the name of the cluster in which the database is hosted.

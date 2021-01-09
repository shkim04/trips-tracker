require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const db = mongoose.connection;
db.on('error', (err) => { console.error(err) });
db.once('open', () => {
    console.log("Conntected to Database");
});

const tripsRouter = require('./routes/trips');

app.use('/trips', tripsRouter);

app.listen(5000, () => {
    console.log(`Server is running on port: 5000`);
});
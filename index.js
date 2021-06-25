const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const port = 5000

app.use(cors());
app.use(bodyParser.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnj3g.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('err', err)
    const bookingsCollection = client.db("aircraft").collection("bookings");

    app.post('/postBooking', (req, res) => {
        const newBooking = req.body;
        bookingsCollection.insertOne(newBooking)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
    })

    app.get('/bookings', (req, res) => {
        bookingsCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    });

    app.get('/userBookings', (req, res) => {
        bookingsCollection.find({ date: req.query.date })
            .toArray((err, items) => {
                res.send(items)
            })
    })


    app.get('/', (req, res) => {
        res.send('Aircraft!')
    })

});

app.listen(process.env.PORT || port)
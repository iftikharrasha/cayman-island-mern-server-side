require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const port = 5000;

const app = express();
app.use(cors()); //middleware
app.use(express.json());

const uri = `mongodb+srv://${process.env.REACT_APP_USERNAME}:${process.env.REACT_APP_PASSWORD}@cluster0.ce7h0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("caymanDb");
        const offersCollection = database.collection("offers");
        const ordersCollection = database.collection("orders");

        //Get Api for offers
        app.get('/all-offers', async (req, res) => {
            const cursor = offersCollection.find({});
            const offers = await cursor.toArray();
            res.send(offers);
        })

        // Get Api for my orders
        app.get('/my-orders/:orderOwner', async (req, res) => {
            const orderOwner = req.params.orderOwner;
            const query = { token: orderOwner };

            const cursor = ordersCollection.find(query);
            const myOrders = await cursor.toArray();
            res.send(myOrders);
        })

        // Get Api for my orders
        app.get('/all-orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const allOrders = await cursor.toArray();
            res.send(allOrders);
        })


        //Single Get Api for offers
        app.get('/place-order/:orderId', async (req, res) => {
            const orderId = req.params.orderId;
            const query = { _id: ObjectId(orderId) };
            const offer = await offersCollection.findOne(query);
            res.send(offer);
        })

        //Post Api for offers
        app.post('/add-offers', async(req, res) => {
                const offer = req.body; //console.log(req.body);
                const result = await offersCollection.insertOne(offer);

                console.log('An offer was inserted:', result);
                res.json(result); //output on client site as a json
        })

        //Post Api for orders
        app.post('/add-order', async(req, res) => {
            const order = req.body; //console.log(req.body);
            const result = await ordersCollection.insertOne(order);

            console.log('An order was inserted:', result);
            res.json(result); //output on client site as a json
        })

        //Delete Api
        app.delete('/cancel/:orderId', async(req, res) => {
            const orderId = req.params.orderId;
            const query = { _id: ObjectId(orderId) };
            const result = await ordersCollection.deleteOne(query);

            res.json(result); //output on client site as a json
        })

    } finally {
    //   await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is loading!');
})

app.listen(port, () => console.log('Server is loading at port@5000'));
require('dotenv').config();
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const port = 5000;

const app = express();
app.use(cors()); //middleware
app.use(express.json());

const uri = `mongodb+srv://${process.env.REACT_APP_USERNAME}:${process.env.REACT_APP_PASSWORD}@cluster0.ce7h0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


// client.connect(err => {
//   const collection = client.db("test").collection("devices");

//   const offers = {
//         category: "Camping",
//         title: "Experience an island night at a variety of resorts",
//         img: "https://cookislands.travel/sites/default/files/styles/max_1300x1300/public/tumunu_ttd-islandNights-A23-2.jpg?itok=JfH5_q0j",
//         desc: "No visit is complete without an ‘Island Night’ cultural show for an unforgettable experience. Available at a variety of resorts and cultural centres on Rarotonga, Aitutaki and Atiu, they are a wonderful evening where passionate locals share our history and traditions through music, song, dance and food. Highly entertaining and fun for everyone, especially when the crowd participates in our traditional dance moves. A highlight for visitors are the exhilarating performances at cultural villages like Te Vara Nui and Highland Paradise Culture Centre or by local dance teams during the island nights staged around Rarotonga by the resorts and hotels. Delicious buffet meals featuring favourite local dishes like ika mata (marinated raw fish salad) are included in the island night packages. There are also the island nights where an umu kai is featured. This buffet style feast of food cooked in a traditional earth oven or umu is a wonderful experience.",
//         price: 180
//   };

//   collection.insertOne(offers).then(() => {
//       console.log('offer inserted!')
//   })
// });


async function run() {
    try {
      await client.connect();
      const database = client.db("caymanDb");
      const offersCollection = database.collection("offers");

      //Get Api
      app.get('/all-offers', async (req, res) => {
          const cursor = offersCollection.find({});
          const offers = await cursor.toArray();
          res.send(offers);
      })

      //Post Api
      app.post('/add-offers', async(req, res) => {
            const offer = req.body; //console.log(req.body);
            const result = await offersCollection.insertOne(offer);

            console.log('A document was inserted:', result);
            res.json(result); //output on client site as a json
      })

    // create a document to insert
    //   const offers = {
    //         category: "Camping",
    //         title: "Experience an island night at a variety of resorts",
    //         img: "https://cookislands.travel/sites/default/files/styles/max_1300x1300/public/tumunu_ttd-islandNights-A23-2.jpg?itok=JfH5_q0j",
    //         desc: "No visit is complete without an ‘Island Night’ cultural show for an unforgettable experience. Available at a variety of resorts and cultural centres on Rarotonga, Aitutaki and Atiu, they are a wonderful evening where passionate locals share our history and traditions through music, song, dance and food. Highly entertaining and fun for everyone, especially when the crowd participates in our traditional dance moves. A highlight for visitors are the exhilarating performances at cultural villages like Te Vara Nui and Highland Paradise Culture Centre or by local dance teams during the island nights staged around Rarotonga by the resorts and hotels. Delicious buffet meals featuring favourite local dishes like ika mata (marinated raw fish salad) are included in the island night packages. There are also the island nights where an umu kai is featured. This buffet style feast of food cooked in a traditional earth oven or umu is a wonderful experience.",
    //         price: 180
    //     };
    //   const result = await offersCollection.insertOne(offers);
    //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
    //   await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is loading!');
})

app.listen(port, () => console.log('Server is loading at port@5000'));
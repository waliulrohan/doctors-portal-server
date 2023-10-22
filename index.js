const express = require('express')
const cors = require('cors');
const bodyParser = require("body-parser")
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const app = express()
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = "mongodb+srv://waliulislam1742:doctors-portal-password@doctors-portal-cluster.owd1jlz.mongodb.net/?retryWrites=true&w=majority";// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const appoinmentsCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.COLLECTION_NAME}`);

    app.post('/addAppoinment', (req, res) => {
      const appoinment = req.body;
      appoinmentsCollection.insertOne(appoinment)
        .then(result => {
          console.log(result.insertedId);
        })
    })

    app.post('/getAppoinmentsByDate', (req, res) => {
      const { date } = req.body; // Extract date from request body
      console.log(date);
      appoinmentsCollection.find({ appointmentDate: date }).toArray()
        .then(documents => {
          res.send(documents); // Send the documents as the response
          console.log(documents); // Log the documents for debugging purposes
        })
        .catch(error => {
          console.error(error); // Log any errors that occur during the database query
          res.status(500).send('Internal Server Error'); // Send an error response to the client
        });
    });


    app.get('/appoinments', (req, res) => {
      appoinmentsCollection.find({}).toArray()
        .then(document => res.send(document))
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Error occurred during MongoDB operation:', error);
  }
}
run().catch(console.dir);



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
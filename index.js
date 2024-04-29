const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;
require("dotenv").config();
const username = process.env.User_Name;
const password = process.env.User_Password;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

//middleware
app.use(cors({
  origin: ["https://tourspotter-bb912.web.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
}));
app.use(express.json());

const uri = `mongodb+srv://${username}:${password}@cluster0.zukg64l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const touristUserCollection = client.db("tourisDB").collection("tourist");
    const countryCollection = client.db("tourisDB").collection("countries");

    app.post("/spot-data", async (req, res) => {
      const spotData = req.body;
      console.log(spotData);
      const result = await touristUserCollection.insertOne(spotData);
      res.send(result);
    });

    app.get("/spot-data", async (req, res) => {
      const cursor = touristUserCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/my-added-spot/:email", async (req, res) => {
      console.log(req.params.body);
      const spot = touristUserCollection.find({ email: req.params.email });
      const result = await spot.toArray();
      res.send(result);
    });

    app.get("/spots/:id", async (req, res) => {
      console.log(req.params.body);
      const spot = touristUserCollection.find({
        _id: new ObjectId(req.params.id),
      });
      const result = await spot.toArray();
      res.send(result);
    });

    //challges part
    app.get("/country/:country_name", async (req, res) => {
      const country = countryCollection.find({country_Name: req.params.country_name});
      const result = await country.toArray();
      res.send(result);
    });
    app.get("/country", async (req, res) => {
      const country = countryCollection.find();
      const result = await country.toArray();
      res.send(result);
    });



    //------------

    app.put("/update-spot/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          image: req.body.image,
          tourists_spot_name: req.body.tourists_spot_name,
          country_Name: req.body.country_Name,
          location: req.body.location,
          average_cost: req.body.average_cost,
          seasonality: req.body.seasonality,
          travel_time: req.body.travel_time,
          totaVisitorsPerYear: req.body.totaVisitorsPerYear,
          short_description: req.body.short_description,
        },
      };
      const result = await touristUserCollection.updateOne(query, data);
      res.send(result);
    });

    app.delete("/delete-spot/:id", async(req, res)=>{
      const result = await touristUserCollection.deleteOne({_id: new ObjectId(req.params.id)})
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    //   await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("testing sever response");
});

app.listen(port, () => {
  console.log(`surver running on port: ${port}`);
});

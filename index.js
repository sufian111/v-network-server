const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectID;
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://admin:admin@cluster0.ccwwc.mongodb.net/v-network?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const event = client.db("v-network").collection("allEvent");
  const registartions = client.db("v-network").collection("allRegistration");
  app.get("/events", (req, res) => {
    event.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.delete("/delete/:id", (req, res) => {
    registartions.deleteOne({ _id: ObjectId(req.params.id) }).then((result) => {
      res.send(result.deletedCount > 0);
    });
  });

  app.get("/admin", (req, res) => {
    registartions.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/myEvents", (req, res) => {
    registartions.find({ email: req.query.email }).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.post("/addEvent", (req, res) => {
    const information = req.body;
    event.insertOne(information);
  });

  app.post("/addRegistration", (req, res) => {
    const information = req.body;
    registartions.insertOne(information);
  });
});

app.listen(process.env.PORT || port);

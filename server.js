const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const bodyparser = require("body-parser");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Middleware
app.use(cors());
app.use(bodyparser.json());

const port = process.env.PORT || 3000;

// Use MONGO_URI from .env
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

// Database Name
const dbName = "passop";

// Connect to MongoDB
client.connect();

app.get("/", async (req, res) => {
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const findResult = await collection.find({}).toArray();
  res.json(findResult);
});

app.post("/", async (req, res) => {
  const password = req.body;
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const result = await collection.insertOne(password);
  res.send({ success: true, result });
});

app.delete("/", async (req, res) => {
  const password = req.body;
  const db = client.db(dbName);
  const collection = db.collection("passwords");
  const result = await collection.deleteOne(password);
  res.send({ success: true, result });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

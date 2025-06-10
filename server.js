const express = require("express");
const app = express();
const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const bodyparser = require("body-parser");
const cors = require("cors");

dotenv.config();

// ✅ Proper CORS setup for local & deployed frontend
app.use(cors({
  origin: [
    "http://localhost:5173", // for local React frontend
    "https://passwordmanager-app.netlify.app" // (optional) replace with real frontend URL when deployed
  ],
  methods: ["GET", "POST", "DELETE"],
  credentials: true
}));

app.use(bodyparser.json());

const port = process.env.PORT || 3000;
const url = process.env.MONGO_URI;

if (!url) {
  console.error("❌ MONGO_URI is missing in .env");
  process.exit(1);
}

const client = new MongoClient(url);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("passop");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

app.get("/", async (req, res) => {
  try {
    const collection = db.collection("passwords");
    const findResult = await collection.find({}).toArray();
    res.json(findResult);
  } catch (err) {
    res.status(500).json({ error: "GET failed", message: err.message });
  }
});

app.post("/", async (req, res) => {
  try {
    const password = req.body;
    const collection = db.collection("passwords");
    const result = await collection.insertOne(password);
    res.send({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: "POST failed", message: err.message });
  }
});

app.delete("/", async (req, res) => {
  try {
    const password = req.body;
    const collection = db.collection("passwords");
    const result = await collection.deleteOne(password);
    res.send({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: "DELETE failed", message: err.message });
  }
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
  });
});

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

// middlewares
app.use(cors());
app.use(express.json());

// database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vfwjfcr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   serverApi: ServerApiVersion.v1,
});

app.get("/", async (req, res) => {
   res.send("Task Management API is running");
});

const run = async () => {
   try {
      // Database Collections
      const tasksCollection = client.db("taskManagement").collection("tasks");

      // Tasks API
      app.get("/tasks", async (req, res) => {
         const query = {};
         const tasks = await tasksCollection.find(query).toArray();
         res.send(tasks);
      });

   } finally {
   }
};
run().catch((err) => console.log(err));


app.listen(port, () => {
   console.log("Task Management server is running on port", port);
});

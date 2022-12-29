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
      const completedTasksCollection = client.db("taskManagement").collection("completedTasks");

      // My Tasks API
      app.get("/tasks", async (req, res) => {
         const query = {};
         const tasks = await tasksCollection.find(query).toArray();
         res.send(tasks);
      });

      app.get("/task/:id", async (req, res) => {
         const id = req.params.id;
         const query = { _id: ObjectId(id) };
         const task = await tasksCollection.findOne(query);
         res.send(task);
      });

      app.post("/tasks", async (req, res) => {
         const task = req.body;
         const result = await tasksCollection.insertOne(task);
         res.send(result);
      });


      app.put("/task/:id", async (req, res) => {
         const id = req.params.id;
         const filter = { _id: ObjectId(id) };
         const task = req.body;
         // console.log('task:', task)
         const options = { upsert: true };
         const updatedDoc = {
            $set: {
               title: task.title,
               description: task.description
            },
         };
         const result = await tasksCollection.updateOne(
            filter,
            updatedDoc,
            options
         );
         res.send(result);
      });

      app.delete("/task/:id", async (req, res) => {
         const id = req.params.id;
         const filter = { _id: ObjectId(id) };
         const result = await tasksCollection.deleteOne(filter);
         res.send(result);
      });


   
   } finally {
   }
};
run().catch((err) => console.log(err));


app.listen(port, () => {
   console.log("Task Management server is running on port", port);
});

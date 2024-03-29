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
      const usersCollection = client.db("taskManagement").collection("users");

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
               description: task.description,
               img: task.img
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


      // Completed tasks API
      app.get("/completed-tasks", async (req, res) => {
         const query = {};
         const completedTasks = await completedTasksCollection.find(query).toArray();
         res.send(completedTasks);
      });


      app.post("/completed-tasks", async (req, res) => {
         const completedTask = req.body;
         const query = {
            title: completedTask.title,
            img: completedTask.img
         };

         const alreadyCompleted = await completedTasksCollection.find(query).toArray();

         if (alreadyCompleted.length) {
            const message = `${completedTask.title} is already mark as Completed`;
            return res.send({ acknowledged: false, message });
         }

         const result = await completedTasksCollection.insertOne(completedTask);
         res.send(result);
      });


      app.delete("/completed-tasks/:id", async (req, res) => {
         const id = req.params.id;
         const filter = { _id: ObjectId(id) };
         const result = await completedTasksCollection.deleteOne(filter);
         res.send(result);
      });


      // Users API
      app.get("/users", async (req, res) => {
         const query = {};
         const users = await usersCollection.find(query).toArray();
         res.send(users);
      });

      app.post("/users", async (req, res) => {
         const user = req.body;
         const result = await usersCollection.insertOne(user);
         res.send(result);
      });

   } finally {
   }
};
run().catch((err) => console.log(err));


app.listen(port, () => {
   console.log("Task Management server is running on port", port);
});

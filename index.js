const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

// middlewares
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
   res.send("Task Management API is running");
});

app.listen(port, () => {
   console.log("Task Management server is running on port", port);
});
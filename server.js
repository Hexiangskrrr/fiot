const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST"],
  })
);
app.use(express.text());

app.get("/get", (req, res) => {
  console.log("GET");
  const receivedData = req.query.data;
  console.log("Received data:", receivedData);
  res.send(`Received data: ${receivedData}`);
});

app.get("/", (req, res) => {
  console.log("/");
  res.send("hello from server");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

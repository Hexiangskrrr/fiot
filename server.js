const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const mysql = require("mysql2");

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "Fiot",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to mysql database");
});

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST"],
  })
);
app.use(express.text());

app.get("/get", (req, res) => {
  // this route is used for testing only, not used in actual project
  console.log("GET");
  const receivedData = req.query.data;
  console.log("Received data:", receivedData);
  console.log("Data type: ", typeof parseFloat(receivedData));
  res.send(`Received data: ${receivedData}`);
});

app.get("/", (req, res) => {
  console.log("/");
  res.send("hello from server");
});

app.get("/addscore", (req, res) => {
  console.log("/addscore");
  const score = parseFloat(req.query.score);
  const difficulty = parseInt(req.query.difficulty);

  const currentDate = new Date();
  const gmtPlus8Date = new Date(currentDate.getTime() + 8 * 60 * 60 * 1000);
  const addedDate = gmtPlus8Date.toISOString().slice(0, 19).replace("T", " ");

  const insertScoreSql =
    "INSERT INTO Scores (score, difficulty, added_date) VALUES (?, ?, ?)";
  con.query(insertScoreSql, [score, difficulty, addedDate], (err, result) => {
    if (err) {
      console.error("Error inserting score:", err);
      return res.status(500).send("Error inserting score");
    }
    res
      .status(200)
      .send(
        `Score added: {score: ${score}, difficulty: ${difficulty}, added_date: ${addedDate}}`
      );
  });
});

app.get("/getscore", (req, res) => {
  console.log("/getscore");
  const getScoreSql = "SELECT * FROM Scores";
  con.query(getScoreSql, [], function (err, result) {
    if (err) {
      console.error("Error getting score:", err);
      res.status(500).send("Error getting score");
    }
    res.status(200).send(result);
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

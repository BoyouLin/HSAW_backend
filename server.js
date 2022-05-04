//取得express和body-parser套件
const express = require("express");
const bodyParser = require("body-parser");

// create express app 準備Express底下的所有功能
const app = express();
app.use("/static", express.static("file"));
const port = process.env.PORT || 8080;
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

const mysql = require("mysql");
const dbConfig = require("./config/database.config.js");
const pool = mysql.createPool(dbConfig);
exports.pool = pool;

pool.on("release", function (connection) {
  console.log("Connection %d released", connection.threadId);
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to MIIAweb2022." });
});

require("./app/routes/routes.js")(app);

// listen for requests
//監聽執行在localhost哪個port號
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

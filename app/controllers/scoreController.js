const serverPool = require("../../server.js").pool;
const sql = require("../sql/sql.js").scoreSQL;

exports.tsetFunction = (req, res) => {
  res.send("Test res.");
};

exports.insertScore = (req, res) => {
  let data = [req.body.employee_ID, req.body.score];
  if (data[0] == "test") {
    console.log("test virtrul insert.");
    res.send("OK");
  } else {
    serverPool.query(sql.insertScore, data, function (err, results, fields) {
      if (err) {
        console.log(err);
        //console.log("### err res: " + err.sqlMessage);
        res.send("NO");
      } else {
        console.log("insert " + data[0] + "score.");
        res.send("OK");
      }
    });
  }
};

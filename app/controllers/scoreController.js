const serverPool = require("../../server.js").pool;
const sql = require("../sql/sql.js").scoreSQL;
exports.tsetFunction = (req, res) => {
  serverPool.query("SELECT * FROM EMPLOYEES", function (err, results, fields) {
    if (err) throw err;
    else console.log("Selected " + results.length + " row(s).");
    for (i = 0; i < results.length; i++) {
      console.log("Row: " + JSON.stringify(results[i]));
    }
    console.log("query Done.");
  });

  /*let testQuery=function(conn){
conn.query('SELECT * FROM inventory', 
    function (err, results, fields) {
        if (err) throw err;
        else console.log('Selected ' + results.length + ' row(s).');
        for (i = 0; i < results.length; i++) {
            console.log('Row: ' + JSON.stringify(results[i]));
        }
        console.log('query Done.');
        conn.release();
    })
}

server.getConn(testQuery);*/
  res.send("Test res.");

  /*subjectModel.find({})
    .then(mydata => {
        res.send(mydata);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });*/
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
        //console.log("###TEST err res: " + err.sqlMessage);
        res.send("NO");
      } else {
        console.log("insert " + data[0] + "score.");
        res.send("OK");
      }
    });
  }
};

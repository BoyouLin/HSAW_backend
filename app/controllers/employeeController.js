const serverPool = require("../../server.js").pool;
const sql = require("../sql/sql.js").employeesSQL;
const crypto = require("crypto");
const userData = require("../../config/userData.js"); //include local test secret

exports.login = (req, res) => {
  let finialResults = {
    loginFlag: 0,
    employee_ID: "",
  };

  const salt = process.env.salt || userData.salt;
  let tempPassword = req.body.password + salt;
  let hash = crypto.createHash("sha256").update(tempPassword).digest("hex");
  let data = [req.body.ID, req.body.ID, hash];
  serverPool.getConnection(function (err, connection) {
    if (err) console.log(err);

    function loginCheck() {
      connection.query(sql.loginCheck, data, function (err, results, fields) {
        if (err) {
          console.log(err);
        } else if (results.length == 0) {
          console.log("帳號或密碼錯誤");
          res.send(finialResults);
          connection.release();
        } else {
          if (results[0]["employee_ID"] == "king") {
            console.log("後臺登入");
            finialResults.loginFlag = 3;
          } else if (results[0]["if_work"] == 0) {
            console.log("你今天不用上班");
            finialResults.loginFlag = 2;
          } else {
            console.log("正常登入");
            finialResults.loginFlag = 1;
          }
          leaveLoginlog();
          console.log(results[0]["employee_ID"] + " is login成功.");
          finialResults.employee_ID = results[0]["employee_ID"];
          res.send(finialResults);
        }
      });
    }

    function leaveLoginlog() {
      if (data[0] == "test") {
        console.log("test login log.");
        connection.release();
      } else {
        connection.query(
          sql.writeLoginLog,
          [req.body.ID],
          function (err, results, fields) {
            if (err) {
              console.log(err);
            } else {
              console.log("insert login log.");
            }
            connection.release();
          }
        );
      }
    }

    loginCheck();
  });
};

//use after insert new employees
exports.SHA256PWFunction = (req, res) => {
  let data = [];
  let pw = [];
  function sqlInsert(dataID, hash) {
    return new Promise((resolve, reject) => {
      serverPool.query(
        sql.craeteSHA1,
        [hash, dataID],
        function (err, results, fields) {
          if (err) {
            console.log(err);
          } else {
            console.log(results);
            console.log(hash);
            resolve();
          }
        }
      );
    });
  }
  async function genarateSHA256() {
    for (let i = 0; i < data.length; i++) {
      let salt = "salt";
      let temp = pw[i] + salt;
      let hash = crypto.createHash("sha256").update(temp).digest("hex");
      await sqlInsert(data[i], hash);
    }
  }
  genarateSHA256();

  res.send("Replcing password");
};

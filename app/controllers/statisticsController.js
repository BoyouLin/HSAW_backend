const serverPool = require("../../server.js").pool;
const sql = require("../sql/sql.js").statisticsSQL;

function dateToTime(date, flag) {
  if (flag == 1) {
    return date + " 00:00:00";
  } else {
    return date + " 23:59:59";
  }
}

exports.subDepartmentAnalyze = (req, res) => {
  let finialResults = {};
  const personFactory = (name, times, average) => {
    return {
      name: name,
      score: [0, 0, 0, 0, 0],
      times: times,
      average: average,
    };
  };
  let data = [
    dateToTime(req.body.start_date, 1),
    dateToTime(req.body.end_date, 0),
    req.body.department_ID,
    req.body.place_sub_number,
  ];
  console.log(data);
  serverPool.getConnection(function (err, connection) {
    if (err) console.log(err);
    connection.query(
      sql.subDepartmentAnalyze,
      data,
      function (err, results, fields) {
        if (err) {
          console.log(err);
        } else {
          let tempID = "";
          results.forEach((item, index, arr) => {
            if (item["employee_ID"] != tempID) {
              //每人的第一行(評分次數和平均)
              finialResults[item["employee_ID"]] = personFactory(
                item["employee_name"],
                item["times"],
                item["average"]
              );
              tempID = item["employee_ID"];
            } else if (typeof item["score"] == "number") {
              finialResults[item["employee_ID"]]["score"][item["score"] - 1] =
                item["times"];
            }
          });

          for (i = 0; i < results.length; i++) {
            console.log("Row: " + JSON.stringify(results[i]));
          }
          console.log("Sub Department Analyze Finsihed.");
          res.send(finialResults);
          connection.release();
        }
      }
    );
  });
};

exports.departmentAnalyze = (req, res) => {
  let finialResults = {};
  const sub_departmentFactory = (name, times, average) => {
    return {
      name: name,
      score: [0, 0, 0, 0, 0],
      times: times,
      average: average,
    };
  };
  let data = [
    dateToTime(req.body.start_date, 1),
    dateToTime(req.body.end_date, 0),
    req.body.department_ID,
  ];
  console.log(data);
  serverPool.getConnection(function (err, connection) {
    if (err) console.log(err);
    connection.query(
      sql.departmentAnalyze,
      data,
      function (err, results, fields) {
        if (err) {
          console.log(err);
        } else {
          let tempID = "";
          results.forEach((item, index, arr) => {
            if (item["place_sub_number"] != tempID) {
              //每人的第一行(評分次數和平均)
              finialResults[item["place_sub_number"]] = sub_departmentFactory(
                item["place_name"],
                item["times"],
                item["average"]
              );
              tempID = item["place_sub_number"];
            } else if (typeof item["score"] == "number") {
              finialResults[item["place_sub_number"]]["score"][
                item["score"] - 1
              ] = item["times"];
            }
          });

          for (i = 0; i < results.length; i++) {
            console.log("Row: " + JSON.stringify(results[i]));
          }
          console.log("Department Analyze Finsihed.");
          res.send(finialResults);
          connection.release();
        }
      }
    );
  });
};

exports.allAnalyze = (req, res) => {
  let finialResults = {};
  const departmentFactory = (name, times, average) => {
    return {
      name: name,
      score: [0, 0, 0, 0, 0],
      times: times,
      average: average,
    };
  };
  let data = [
    dateToTime(req.body.start_date, 1),
    dateToTime(req.body.end_date, 0),
  ];
  console.log(data);
  serverPool.getConnection(function (err, connection) {
    if (err) console.log(err);
    connection.query(sql.allAnalyze, data, function (err, results, fields) {
      if (err) {
        console.log(err);
      } else {
        let tempID = "";
        results.forEach((item) => {
          if (item["department_ID"] != tempID) {
            //每人的第一行(評分次數和平均)
            finialResults[item["department_ID"]] = departmentFactory(
              item["department_name"],
              item["times"],
              item["average"]
            );
            tempID = item["department_ID"];
          } else if (typeof item["score"] == "number") {
            finialResults[item["department_ID"]]["score"][item["score"] - 1] =
              item["times"];
          }
        });

        for (i = 0; i < results.length; i++) {
          console.log("Row: " + JSON.stringify(results[i]));
        }
        console.log(finialResults);
        console.log("All Analyze Finsihed.");
        res.send(finialResults);
        connection.release();
      }
    });
  });
};

exports.getEmployeeOptions = (req, res) => {
  let finialResults = { "000": "所有人員" };
  let data = [
    dateToTime(req.body.start_date, 1),
    dateToTime(req.body.end_date, 0),
    dateToTime(req.body.start_date, 1),
    dateToTime(req.body.end_date, 0),
    req.body.department_ID,
    req.body.place_sub_number,
  ];
  serverPool.getConnection(function (err, connection) {
    if (err) console.log(err);
    connection.query(
      sql.getEmployeeOptions,
      data,
      function (err, results, fields) {
        if (err) {
          console.log(err);
        } else {
          results.forEach((item) => {
            finialResults[item["employee_ID"]] = item["employee_name"];
          });
          console.log(results);
          console.log("res empoyee options Finsihed.");
          res.send(finialResults);
          connection.release();
        }
      }
    );
  });
};

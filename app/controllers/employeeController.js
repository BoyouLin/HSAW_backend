const serverPool = require("../../server.js").pool;
const sql = require("../sql/sql.js").employeesSQL;
//const fs = require("fs");
//const pdf = require("pdf-poppler");

exports.login = (req, res) => {
  let finialResults = {
    loginFlag: 0,
    employee_ID: "",
    //qrcode: "",
    //announcements: [],
  };
  //let host = "https://hospitalstaffassessmentserver.azurewebsites.net:443/";
  //let qrcodeDir = host + "static/employees_qrcode/";
  //let announcementDirPDF = ".\\file\\announcement_pdf\\";
  //let announcementDirPNG = ".\\file\\announcement_png\\";
  //let announcementAddress = host + "static/announcement_png/";
  let data = [req.body.ID, req.body.ID, req.body.password];

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
          if (results[0]["if_work"] == 0) {
            console.log("你今天不用上班");
            finialResults.loginFlag = 2;
          } else {
            console.log("正常登入");
            finialResults.loginFlag = 1;
          }
          leaveLoginlog();
          console.log(results[0]["employee_ID"] + " is login成功.");
          finialResults.employee_ID = results[0]["employee_ID"];
          //finialResults.qrcode = qrcodeDir + results[0]["QRcode_location"];
          //announcementProcess();
          res.send(finialResults);
          //console.log(2);
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

    /*function announcementProcess() {
      console.log(1);
      connection.query(
        sql.announcementProcess,
        async function (err, results, fields) {
          leaveLoginlog();
          if (err) {
            console.log(err);
          } else if (results.length == 0) {
            console.log("目前沒有公告");
          } else {
            console.log(3);
            await pngCheck(results);
          }
          console.log("Response finialResults.");
          res.send(finialResults);
        }
      );
    }

    async function pngCheck(results) {
      let opts = {
        format: "png",
        out_dir: announcementDirPNG, //資料夾
        out_prefix: "", //文件名
        page: 1, //-1
      };
      try {
        for (let i = 0; i < results.length; i++) {
          let file = announcementDirPDF + results[i]["file_location"];
          let fileName = results[i]["file_location"].slice(0, -4); //去除副檔名
          finialResults.announcements.push(
            announcementAddress + fileName + "-1.png"
          );
          if (!fs.existsSync(announcementDirPNG + fileName + "-1.png")) {
            opts.out_prefix = fileName;
            await pdf.convert(file, opts);
            console.log("Successfully converted " + file);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }*/

    loginCheck();
  });
};

exports.logout = (req, res) => {
  serverPool.query(
    sql.writeLogoutLog,
    [req.body.ID],
    function (err, results, fields) {
      if (err) {
        console.log(err);
        res.send("NO");
      } else {
        console.log("insert logout log.");
        console.log(req.body.ID + " logout.");
        res.send("OK");
      }
    }
  );
};

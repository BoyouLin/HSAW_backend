const serverPool = require("../../server.js").pool;
const sql = require("../sql/sql.js").announcementSQL;
const fs = require("fs");
const pdf = require("pdf-poppler");

exports.getAnnouncement = (req, res) => {
  let finialResults = {
    announcements: [],
    nextCallSeconds: -1,
  };
  let host = "https://hospitalstaffassessmentserver.azurewebsites.net:443/";
  //let host = "http://localhost:8080/";
  let announcementDirPDF = ".\\file\\announcement_pdf\\";
  let announcementDirPNG = ".\\file\\announcement_png\\";
  let announcementAddress = host + "static/announcement_png/";
  serverPool.getConnection(function (err, connection) {
    if (err) console.log(err);

    function getAnnouncements() {
      return new Promise((resolve, reject) => {
        connection.query(
          sql.getAnnouncements,
          async function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve();
            } else if (results.length == 0) {
              console.log("目前沒有公告");
              resolve();
            } else {
              console.log(1);
              await pngCheck(results);
              console.log(3);
              resolve();
            }
          }
        );
      });
    }

    async function pngCheck(results) {
      let opts = {
        format: "png",
        scale: 1210, //產出寬度
        out_dir: announcementDirPNG, //資料夾
        out_prefix: "", //文件名
        page: null, //1
      };
      try {
        for (let i = 0; i < results.length; i++) {
          let file = announcementDirPDF + results[i]["file_location"]; //取得完整路徑
          let fileName = results[i]["file_location"].slice(0, -4); //去除副檔名的檔名
          await pdf.info(file).then((pdfinfo) => {
            //取得頁數推入回傳陣列
            console.log(pdfinfo);
            let pageNumber = Number(pdfinfo.pages);
            for (let j = 1; j <= pageNumber; j++) {
              finialResults.announcements.push(
                `${announcementAddress}${fileName}-${j}.png`
              );
            }
          });

          if (!fs.existsSync(announcementDirPNG + fileName + "-1.png")) {
            //png轉檔檢查
            opts.out_prefix = fileName;
            await pdf.convert(file, opts);
            console.log("Successfully converted " + file);
          }
        }
      } catch (error) {
        console.error(error);
      }
      console.log(2);
    }

    function getNextCallTime() {
      return new Promise((resolve, reject) => {
        connection.query(
          sql.getNextCallMinutes,
          function (err, results, fields) {
            if (err) {
              console.log(err);
              resolve();
            } else if (
              results[0]["next_call_minutes"] == null ||
              results[0]["next_call_minutes"] >= 86400
            ) {
              console.log("暫時不須更新公告");
              resolve();
            } else {
              finialResults.nextCallSeconds =
                (results[0]["next_call_minutes"] + 1) * 60;
              console.log(8);
              resolve();
            }
          }
        );
      });
    }

    async function announcementRES() {
      await getAnnouncements();
      console.log(7);
      await getNextCallTime();
      console.log(9);
      connection.release();
      console.log("Response finialResults.");
      res.send(finialResults);
    }
    announcementRES();
  });
};

exports.getAnnouncementtest = (req, res) => {
  let finialResults = {
    announcements: [],
    nextCallSeconds: Math.floor(Math.random() * 5) + 5,
  };
  let length = Math.floor(Math.random() * 5) + 1;
  for (let i = 0; i <= length; i++) {
    finialResults.announcements.push(
      "https://picsum.photos/1210/681/?random=" +
        Math.floor(Math.random() * 10) * 10
    );
  }
  res.send(finialResults);
};

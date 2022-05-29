module.exports = (app) => {
  const scoreController = require("../controllers/scoreController.js");
  const employeeController = require("../controllers/employeeController.js");
  const announcementController = require("../controllers/announcementController.js");
  const statisticsController = require("../controllers/statisticsController.js");

  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    //res.setHeader('Access-Control-Allow-Origin', 'https://chu289.github.io','https://boyoulin.github.io');

    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    //"Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept"
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With, Content-Type"
    );

    // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });

  // 取得test資料
  app.get("/test/", scoreController.tsetFunction);
  //評分紀錄
  app.post("/score/", scoreController.insertScore);
  //登入回傳
  app.post("/login/", employeeController.login);
  //取得公告
  app.get("/announcements/", announcementController.getAnnouncement);
  //測試公告回傳
  app.get("/announcementstest/", announcementController.getAnnouncementtest);
  //部門分支統計
  app.post(
    "/sub_department_analyze/",
    statisticsController.subDepartmentAnalyze
  );
  //部門統計
  app.post("/department_analyze/", statisticsController.departmentAnalyze);
  //全院統計
  app.post("/all_analyze/", statisticsController.allAnalyze);
  //取得時段地點內的員工資料
  app.post("/get_employee_options/", statisticsController.getEmployeeOptions);
};

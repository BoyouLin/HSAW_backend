module.exports = (app) => {
  const scoreController = require("../controllers/scoreController.js");
  const employeeController = require("../controllers/employeeController.js");
  const announcementController = require("../controllers/announcementController.js");
  app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    //res.setHeader('Access-Control-Allow-Origin', 'https://chu289.github.io');

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

  //傳入{"employee_ID":"admin", "score":5, "Comment":"", "place_ID":"A001"}
  //回傳什麼???
  app.post("/score/", scoreController.insertScore);
  //  傳入{"ID":"admin", "password":"0000"}
  //  回傳
  //   {
  //     "loginFlag": true,
  //     "employee_ID": "admin",
  //     "qrcode": "http://localhost:8080/static/employees_qrcode/admin.png",
  //     "announcements": [
  //         "http://localhost:8080/static/announcement_png/A0000001-1.png",
  //         "http://localhost:8080/static/announcement_png/A0000002-1.png",
  //         "http://localhost:8080/static/announcement_png/B0000001-1.png"]
  //    }
  app.post("/login/", employeeController.login);
  app.post("/logout/", employeeController.logout);
  app.get("/announcements/", announcementController.getAnnouncement);
  app.get("/announcementstest/", announcementController.getAnnouncementtest);

  /*
    // 創立醫院資料
    app.post('/testRoute', hospitalController.create);

    // 取得所有醫院資料
    app.get('/hospital', hospitalController.findAll);

    //取得查詢的醫院資料
    //?distance=20&lon=121.431877&lat=25.037998&city=新北市&min_score=60&max_score=70
    //distance幾公里內,lon經度,lat緯度,city縣市,min_score最低分,max_score最高分
    //沒有要查詢的參數，值可留空或不寫即可
    app.get('/hospital/query/', hospitalController.query);

    app.get('/hospital/c3_data',hospitalController.c3Data);

    //建立一則留言資料
    app.post('/Review/', reviewController.create);//已改版去掉"create"這個字

    //取得所有留言的資料
    app.get('/allReviews/', reviewController.findAll);

    //取得10大排名醫院的特定資料
    app.get('/hospital/top10Hospital', hospitalController.top10Hospital);

    //取得某縣市的醫院資料
    //app.get('/hospital/city/:city', controller.findHospitalWithCity);

    //以query傳入參數
    app.get('/test/', hospitalController.tsetFunction);
    
    //驗證網頁密碼
    app.post('/protect/', hospitalController.protect);
    // Retrieve a single Note with noteId
    //app.get('/testRoute/:noteId', controller.findOne);

    // Update a Note with noteId
    //app.put('/testRoute/:noteId', controller.update);

    // Delete a Note with noteId
    //app.delete('/testRoute/:noteId', controller.delete);

    //app.get('/testRoute/findHospital', controller.findHospital);*/
};

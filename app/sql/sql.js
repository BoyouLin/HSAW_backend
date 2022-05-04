const employeesSQL = {
  loginCheck:
    "SELECT employee_ID,QRcode_location,(1=ANY(SELECT (NOW() BETWEEN work_time AND offwork_time) FROM work_schedules WHERE employee_id=?)) 'if_work' FROM employees WHERE employee_id=? AND employee_password = ?;",
  announcementProcess:
    "SELECT file_location FROM announcements WHERE NOW() BETWEEN release_time AND maturity_time;",
  writeLoginLog:
    "INSERT INTO `loginout_log` (`employee_ID`,`login_flag`,`log_time`) VALUES (?,1,NOW());",
  writeLogoutLog:
    "INSERT INTO `loginout_log` (`employee_ID`,`login_flag`,`log_time`) VALUES (?,0,NOW());",
};

const scoreSQL = {
  insertScore:
    "INSERT INTO `score_records` (`employee_ID`,`record_time`,`score`) VALUES (?,current_time(),?);",
};

const announcementSQL = {
  getNextCallMinutes:
    "SELECT TIMESTAMPDIFF(MINUTE,NOW(),MIN(u.alltime)) 'next_call_minutes' FROM (SELECT release_time 'alltime' FROM announcements WHERE NOW()<=release_time UNION ALL SELECT maturity_time FROM announcements WHERE NOW()<=maturity_time) u;",
  getAnnouncements:
    "SELECT file_location FROM `announcements` WHERE NOW()>release_time AND (NOW()<maturity_time OR maturity_time IS NULL);",
  insertAnnouncements:
    "INSERT INTO `announcements` (`annoucement_ID`,`release_time`,`maturity_time`,`file_location`) VALUES (?,?,?,?);",
};

const statisticsSQL = {
  testfilter: "",
};

exports.employeesSQL = employeesSQL;
exports.scoreSQL = scoreSQL;
exports.announcementSQL = announcementSQL;
exports.statisticsSQL = statisticsSQL;

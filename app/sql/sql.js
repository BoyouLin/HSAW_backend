const employeesSQL = {
  loginCheck:
    "SELECT employee_ID,QRcode_location,(1=ANY(SELECT (NOW() BETWEEN work_time AND offwork_time) FROM work_schedules WHERE employee_id=?)) 'if_work' FROM employees WHERE employee_id=? AND employee_password = ?;",
  writeLoginLog:
    "INSERT INTO `login_log` (`employee_ID`,`login_time`) VALUES (?,NOW());",
  craeteSHA1:
    "UPDATE `employees` SET `employee_password` = ? WHERE `employee_ID` = ?",
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
  subDepartmentAnalyze:
    "SELECT t.employee_ID,e.employee_name, t.score ,t.times, t.average FROM (SELECT w.employee_ID,s.score ,COUNT(score) 'times', IFNULL(AVG(score), 0) 'average' FROM work_schedules w LEFT OUTER JOIN score_records s ON w.employee_ID = s.employee_ID AND s.record_time BETWEEN ? AND ? AND s.record_time BETWEEN w.work_time AND w.offwork_time WHERE w.department_ID=? AND w.place_sub_number=? GROUP BY w.employee_ID,s.score WITH ROLLUP) t JOIN employees e ON t.employee_ID=e.employee_ID ORDER BY 1,3,5 DESC;",
  departmentAnalyze:
    "SELECT t.place_sub_number, t.place_name, t.score, t.times, t.average FROM (SELECT ds.place_sub_number, ANY_VALUE(ds.place_name) 'place_name',s.score,COUNT(score) 'times', IFNULL(AVG(score), 0) 'average' FROM work_schedules w JOIN score_records s ON w.employee_ID = s.employee_ID AND s.record_time BETWEEN ? AND ? AND s.record_time BETWEEN w.work_time AND w.offwork_time RIGHT OUTER JOIN dns_sub ds  ON w.department_ID=ds.department_ID AND w.place_sub_number = ds.place_sub_number WHERE ds.department_ID=? GROUP BY ds.place_sub_number, s.score WITH ROLLUP HAVING place_sub_number IS NOT NULL) t ORDER BY t.place_sub_number,t.score;",
  allAnalyze:
    "SELECT department_ID, department_name, score, times, average FROM (SELECT d.department_ID, ANY_VALUE(d.department_name) 'department_name', s.score,COUNT(score) 'times', IFNULL(AVG(score), 0) 'average' FROM score_records s JOIN work_schedules w ON s.employee_ID = w.employee_ID AND s.record_time BETWEEN ? AND ? AND s.record_time BETWEEN w.work_time AND w.offwork_time RIGHT OUTER JOIN dns d  ON w.department_ID=d.department_ID GROUP BY d.department_ID, s.score WITH ROLLUP HAVING department_ID IS NOT NULL) t ORDER BY 1,3;",
  getEmployeeOptions:
    "SELECT e.employee_ID,e.employee_name FROM employees e JOIN work_schedules w ON e.employee_ID=w.employee_ID AND NOT((?<=w.work_time AND ?<=w.work_time) OR (?>=w.offwork_time AND ?>=w.offwork_time)) WHERE w.department_ID=? AND w.place_sub_number=? GROUP BY e.employee_ID;",
};

exports.employeesSQL = employeesSQL;
exports.scoreSQL = scoreSQL;
exports.announcementSQL = announcementSQL;
exports.statisticsSQL = statisticsSQL;

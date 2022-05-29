const userData = require("./userData.js");
module.exports = {
  host: "miiawebdb.mysql.database.azure.com",
  user: process.env.MySQL_account || userData.account,
  password: process.env.MySQL_key || userData.pw,
  database: process.env.Database || userData.database,
  port: 3306,
  ssl: true,
  connectionLimit: 50,
};

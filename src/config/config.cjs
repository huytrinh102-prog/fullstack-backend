// require("dotenv").config();
// module.exports = {
//   production: {
//     username: process.env.MYSQLUSER,
//     password: process.env.MYSQLPASSWORD,
//     database: process.env.MYSQLDATABASE,
//     host: process.env.MYSQLHOST,
//     port: Number(process.env.MYSQLPORT || 3306),
//     dialect: "mysql",
//     logging: false,
//     define: { freezeTableName: true },
//   },
// };
require("dotenv").config();

module.exports = {
  production: {
    use_env_variable: "DATABASE_URL",
    dialect: "mysql",
    logging: false,
    define: { freezeTableName: true },
  },
};

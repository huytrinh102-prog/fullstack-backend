module.exports = {
  production: {
    username: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    host: process.env.MYSQLHOST,
    port: Number(process.env.MYSQLPORT || 3306),
    dialect: "mysql",
    logging: false,
    define: { freezeTableName: true },
  },
};

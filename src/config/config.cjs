require("dotenv").config();

const baseConfig = {
  dialect: "mysql",
  logging: false,
  define: { freezeTableName: true },
};

const fromEnv = {
  username: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  host: process.env.MYSQLHOST,
  port: Number(process.env.MYSQLPORT || 3306),
};

const productionUrlEnv = process.env.DATABASE_URL
  ? "DATABASE_URL"
  : process.env.MYSQL_URL
    ? "MYSQL_URL"
    : null;

const withUrlFallback = (config) => ({
  ...(productionUrlEnv ? { use_env_variable: productionUrlEnv } : config),
  ...baseConfig,
});

module.exports = {
  development: withUrlFallback({
    username: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || null,
    database: process.env.MYSQLDATABASE || "jwt",
    host: process.env.MYSQLHOST || "127.0.0.1",
    port: Number(process.env.MYSQLPORT || 3306),
  }),
  test: withUrlFallback({
    username: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || null,
    database: process.env.MYSQLDATABASE || "database_test",
    host: process.env.MYSQLHOST || "127.0.0.1",
    port: Number(process.env.MYSQLPORT || 3306),
  }),
  production: withUrlFallback(fromEnv),
};

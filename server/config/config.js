require("dotenv").config(); // this is important!
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_DEV,
    host: process.env.DB_HOST,
    dialect: "mysql",
    define: { underscored: true },
    logging: false,
  },
  test: {
    username: process.env.DB_USERNAME || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DATABASE_TEST,
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "mysql",
    define: { underscored: true },
    logging: false,
  },
  production: {
    // username: "root",
    // password: null,
    // database: "database_production",
    // host: "127.0.0.1",
    // dialect: "mysql",
    use_env_variable: "JAWSDB_URL",
    dialect: "mysql",
    define: { underscored: true },
  },
};

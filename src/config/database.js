require("dotenv/config");

module.exports = {
  dialect: "mysql",
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASS,
  database: process.env.MYSQL_DATABASE,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};

import Sequelize from "sequelize";

import User from "../app/models/User";
import Invetory from "../app/models/Invetory";

import databaseConfig from "../config/database";

const models = [User, Invetory];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();

import Sequelize from "sequelize";

import User from "../app/models/User";
import Invetory from "../app/models/Invetory";
import File from "../app/models/File";
import Borrewed from "../app/models/Borrowed";

import databaseConfig from "../config/database";

const models = [User, Invetory, File, Borrewed];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();

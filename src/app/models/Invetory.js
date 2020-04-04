import Sequelize, { Model } from "sequelize";

class Invetory extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        location: Sequelize.STRING,
        amount: Sequelize.INTEGER,
        amount_available: Sequelize.INTEGER,
        borrowed_amount: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Invetory;

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

  static associate(models) {
    this.hasMany(models.Borrowed, { foreignKey: "item_id", as: "item" });
  }
}

export default Invetory;

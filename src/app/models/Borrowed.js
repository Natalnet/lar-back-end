import Sequelize, { Model } from "sequelize";

class Borrowed extends Model {
  static init(sequelize) {
    super.init(
      {
        amount: Sequelize.INTEGER,
        returned_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
    this.belongsTo(models.Invetory, { foreignKey: "item_id", as: "item" });
  }
}

export default Borrowed;

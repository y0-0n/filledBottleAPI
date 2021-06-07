/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'product',
        key: 'id'
      }
    },
    plant_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'plant',
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    changeDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    change: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    category: {
      type: DataTypes.ENUM('상품매입','외주생산','자가생산'),
      allowNull: true
    },
    memo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    flag: {
      type: DataTypes.ENUM('order','stock','produce','manufacture'),
      allowNull: true,
      defaultValue: 'order'
    }
  }, {
    tableName: 'stock'
  });
};

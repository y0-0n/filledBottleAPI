/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('stock_manufacture', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    stock_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'stock',
        key: 'id'
      }
    },
    manufacture_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'manufacture',
        key: 'id'
      }
    },
    flag: {
      type: DataTypes.ENUM('produce','consume'),
      allowNull: false,
      defaultValue: 'produce'
    }
  }, {
    tableName: 'stock_manufacture'
  });
};

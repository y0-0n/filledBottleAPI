/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    grade: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    barcode: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    family: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'productFamily_user',
        key: 'family_id'
      }
    },
    price_receiving: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    price_shipping: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    weight: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    safety_stock: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    file_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    detail_file: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    set: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    mallVisible: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: '0'
    },
    state: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: '3'
    }
  }, {
    tableName: 'product'
  });
};

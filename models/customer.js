/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('customer', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    delegate: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    telephone: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    cellphone: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    keyword: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    set: {
      type: DataTypes.INTEGER(4),
      allowNull: true
    },
    transfer: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    manager: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    file_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    crNumber: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    tableName: 'customer'
  });
};

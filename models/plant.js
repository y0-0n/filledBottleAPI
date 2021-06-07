/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('plant', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    division: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    additional_company: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    set: {
      type: DataTypes.INTEGER(4),
      allowNull: true,
      defaultValue: '1'
    },
    outsourcing_company: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'plant'
  });
};

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('productFamily_user', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    family_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0',
      references: {
        model: 'productFamily',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0',
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'productFamily_user'
  });
};

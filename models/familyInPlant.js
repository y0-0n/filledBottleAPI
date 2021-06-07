/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('familyInPlant', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    plant_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'plant',
        key: 'id'
      }
    },
    family_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'productFamily_user',
        key: 'id'
      }
    },
    set: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1'
    }
  }, {
    tableName: 'familyInPlant'
  });
};

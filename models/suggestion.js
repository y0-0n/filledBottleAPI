/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('suggestion', {
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
    title: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    content: {
      type: DataTypes.STRING(450),
      allowNull: true
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    answer: {
      type: DataTypes.STRING(450),
      allowNull: true
    }
  }, {
    tableName: 'suggestion'
  });
};

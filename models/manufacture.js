/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('manufacture', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    memo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    set: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1'
    },
    createdDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'manufacture'
  });
};

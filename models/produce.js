/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('produce', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    previous_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'produce',
        key: 'id'
      }
    },
    weather: {
      type: DataTypes.ENUM('맑음','구름조금','구름많음','흐림','비','눈','비/눈'),
      allowNull: false
    },
    rain: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    snow: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    temperatures: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    min_temp: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    max_temp: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    product_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'product',
        key: 'id'
      }
    },
    process: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    content: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    area: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false
    },
    expected_output: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    file_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'produce'
  });
};

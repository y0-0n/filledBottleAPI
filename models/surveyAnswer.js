/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('surveyAnswer', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
      references: {
        model: 'survey_content',
        key: 'id'
      }
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    answer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'surveyAnswer'
  });
};

/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('survey_content', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    question: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    answer1: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    answer2: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    answer3: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    answer4: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, {
    tableName: 'survey_content'
  });
};

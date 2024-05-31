const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const reports = sequelize.define(
    'reports',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      generated_at: {
        type: DataTypes.DATE,
      },

      report_type: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  reports.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.reports.hasMany(db.file, {
      as: 'report_file',
      foreignKey: 'belongsToId',
      constraints: false,
      scope: {
        belongsTo: db.reports.getTableName(),
        belongsToColumn: 'report_file',
      },
    });

    db.reports.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.reports.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return reports;
};

const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const categories = sequelize.define(
    'categories',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
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

  categories.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.categories.hasMany(db.coffee_blends, {
      as: 'coffee_blends_category',
      foreignKey: {
        name: 'categoryId',
      },
      constraints: false,
    });

    //end loop

    db.categories.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.categories.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return categories;
};

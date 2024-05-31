const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Coffee_blendsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const coffee_blends = await db.coffee_blends.create(
      {
        id: data.id || undefined,

        name: data.name || null,
        price: data.price || null,
        stock_level: data.stock_level || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await coffee_blends.setCategory(data.category || null, {
      transaction,
    });

    return coffee_blends;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const coffee_blendsData = data.map((item, index) => ({
      id: item.id || undefined,

      name: item.name || null,
      price: item.price || null,
      stock_level: item.stock_level || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const coffee_blends = await db.coffee_blends.bulkCreate(coffee_blendsData, {
      transaction,
    });

    // For each item created, replace relation files

    return coffee_blends;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const coffee_blends = await db.coffee_blends.findByPk(
      id,
      {},
      { transaction },
    );

    await coffee_blends.update(
      {
        name: data.name || null,
        price: data.price || null,
        stock_level: data.stock_level || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await coffee_blends.setCategory(data.category || null, {
      transaction,
    });

    return coffee_blends;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const coffee_blends = await db.coffee_blends.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of coffee_blends) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of coffee_blends) {
        await record.destroy({ transaction });
      }
    });

    return coffee_blends;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const coffee_blends = await db.coffee_blends.findByPk(id, options);

    await coffee_blends.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await coffee_blends.destroy({
      transaction,
    });

    return coffee_blends;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const coffee_blends = await db.coffee_blends.findOne(
      { where },
      { transaction },
    );

    if (!coffee_blends) {
      return coffee_blends;
    }

    const output = coffee_blends.get({ plain: true });

    output.category = await coffee_blends.getCategory({
      transaction,
    });

    return output;
  }

  static async findAll(filter, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.categories,
        as: 'category',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.name) {
        where = {
          ...where,
          [Op.and]: Utils.ilike('coffee_blends', 'name', filter.name),
        };
      }

      if (filter.priceRange) {
        const [start, end] = filter.priceRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            price: {
              ...where.price,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            price: {
              ...where.price,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.stock_levelRange) {
        const [start, end] = filter.stock_levelRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            stock_level: {
              ...where.stock_level,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            stock_level: {
              ...where.stock_level,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.category) {
        var listItems = filter.category.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          categoryId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.coffee_blends.count({
            where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.coffee_blends.findAndCountAll({
          where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit) {
    let where = {};

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('coffee_blends', 'name', query),
        ],
      };
    }

    const records = await db.coffee_blends.findAll({
      attributes: ['id', 'name'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['name', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.name,
    }));
  }
};

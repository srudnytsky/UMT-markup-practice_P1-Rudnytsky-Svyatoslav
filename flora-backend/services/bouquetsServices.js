const { Op } = require('sequelize');
const { Bouquet } = require('../models');
const listBouquets = async ({ page, limit, category, search } = {}) => {
  const where = {};

  if (category && category !== 'all') {
    where.category = category;
  }

  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const queryOptions = { where, order: [['id', 'ASC']] };

  if (limit) {
    queryOptions.limit = Number(limit);
    queryOptions.offset = (Number(page || 1) - 1) * Number(limit);
  }

  return Bouquet.findAll(queryOptions);
};

const getBouquetById = (id) => Bouquet.findByPk(id);

const createBouquet = (data) => Bouquet.create(data);

const updateBouquetById = async (id, data) => {
  const bouquet = await Bouquet.findByPk(id);
  if (!bouquet) return null;
  return bouquet.update(data);
};

const deleteBouquetById = async (id) => {
  const bouquet = await Bouquet.findByPk(id);
  if (!bouquet) return null;
  await bouquet.destroy();
  return bouquet;
};

module.exports = {
  listBouquets,
  getBouquetById,
  createBouquet,
  updateBouquetById,
  deleteBouquetById,
};

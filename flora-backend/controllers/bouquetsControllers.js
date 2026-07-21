const path = require('path');
const fs = require('fs/promises');
const gravatar = require('gravatar');

const HttpError = require('../helpers/HttpError');
const ctrlWrapper = require('../helpers/ctrlWrapper');
const bouquetsServices = require('../services/bouquetsServices');

const publicPhotosDir = path.join(__dirname, '../public/photos');

const getAll = async (req, res) => {
  const { page, limit, category, search } = req.query;
  const bouquets = await bouquetsServices.listBouquets({ page, limit, category, search });
  res.status(200).json(bouquets);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const bouquet = await bouquetsServices.getBouquetById(id);

  if (!bouquet) {
    throw new HttpError(404, 'Not found');
  }

  res.status(200).json(bouquet);
};

const create = async (req, res) => {
  const photoURL =
    req.body.photoURL ||
    gravatar.url(req.body.title || 'bouquet', { s: '300', d: 'identicon' }, true);

  const bouquet = await bouquetsServices.createBouquet({ ...req.body, photoURL });
  res.status(201).json(bouquet);
};

const update = async (req, res) => {
  const { id } = req.params;

  if (Object.keys(req.body).length === 0) {
    throw new HttpError(400, 'Body must have at least one field');
  }

  const bouquet = await bouquetsServices.updateBouquetById(id, req.body);

  if (!bouquet) {
    throw new HttpError(404, 'Not found');
  }

  res.status(200).json(bouquet);
};

const remove = async (req, res) => {
  const { id } = req.params;
  const bouquet = await bouquetsServices.deleteBouquetById(id);

  if (!bouquet) {
    throw new HttpError(404, 'Not found');
  }

  res.status(200).json({ message: 'Deleted successfully' });
};

const updateFavorite = async (req, res) => {
  const { id } = req.params;
  const bouquet = await bouquetsServices.updateBouquetById(id, {
    favorite: req.body.favorite,
  });

  if (!bouquet) {
    throw new HttpError(404, 'Not found');
  }

  res.status(200).json(bouquet);
};

const updatePhoto = async (req, res) => {
  const { id } = req.params;

  if (!req.file) {
    throw new HttpError(400, 'Photo file is required');
  }

  const bouquet = await bouquetsServices.getBouquetById(id);

  if (!bouquet) {
    await fs.unlink(req.file.path);
    throw new HttpError(404, 'Not found');
  }

  const uniqueFilename = `${id}_${Date.now()}${path.extname(req.file.originalname)}`;
  const targetPath = path.join(publicPhotosDir, uniqueFilename);

  await fs.rename(req.file.path, targetPath);

  const photoURL = `/photos/${uniqueFilename}`;
  await bouquet.update({ photoURL });

  res.status(200).json({ photoURL });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  create: ctrlWrapper(create),
  update: ctrlWrapper(update),
  remove: ctrlWrapper(remove),
  updateFavorite: ctrlWrapper(updateFavorite),
  updatePhoto: ctrlWrapper(updatePhoto),
};

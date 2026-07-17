const express = require('express');

const ctrl = require('../controllers/bouquetsControllers');
const validateBody = require('../middlewares/validateBody');
const isValidId = require('../middlewares/isValidId');
const upload = require('../middlewares/upload');
const {
  createBouquetSchema,
  updateBouquetSchema,
  updateFavoriteSchema,
} = require('../schemas/bouquetsSchemas');

const router = express.Router();

router.get('/', ctrl.getAll);
router.get('/:id', isValidId, ctrl.getById);

router.post('/', validateBody(createBouquetSchema), ctrl.create);

router.put('/:id', isValidId, validateBody(updateBouquetSchema), ctrl.update);

router.delete('/:id', isValidId, ctrl.remove);

router.patch(
  '/:id/favorite',
  isValidId,
  validateBody(updateFavoriteSchema),
  ctrl.updateFavorite
);

router.patch('/:id/photo', isValidId, upload.single('photo'), ctrl.updatePhoto);

module.exports = router;
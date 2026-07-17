const Joi = require('joi');

const CATEGORIES = ['romantic', 'pastel', 'bright', 'rustic', 'elegant'];

// Used for POST /api/bouquets
const createBouquetSchema = Joi.object({
  title: Joi.string().min(2).max(100).required(),
  description: Joi.string().min(5).max(1000).required(),
  price: Joi.number().positive().required(),
  category: Joi.string().valid(...CATEGORIES).optional(),
  photoURL: Joi.string().uri().optional(),
  favorite: Joi.boolean().optional(),
});

// Used for PUT /api/bouquets/:id — everything optional, but at least
// one field must be present (checked in the controller: empty body -> 400)
const updateBouquetSchema = Joi.object({
  title: Joi.string().min(2).max(100),
  description: Joi.string().min(5).max(1000),
  price: Joi.number().positive(),
  category: Joi.string().valid(...CATEGORIES),
  photoURL: Joi.string().uri(),
  favorite: Joi.boolean(),
}).min(1);

// Used for PATCH /api/bouquets/:id/favorite
const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  CATEGORIES,
  createBouquetSchema,
  updateBouquetSchema,
  updateFavoriteSchema,
};

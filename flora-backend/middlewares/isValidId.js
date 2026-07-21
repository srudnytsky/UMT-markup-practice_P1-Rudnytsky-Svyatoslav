const HttpError = require('../helpers/HttpError');

const isValidId = (req, res, next) => {
  const { id } = req.params;

  if (!/^\d+$/.test(id)) {
    return next(new HttpError(400, `${id} is not a valid id`));
  }

  next();
};

module.exports = isValidId;

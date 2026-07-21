const path = require('path');
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const multer = require('multer');

const apiRouter = require('./routes/api');
const swaggerDocument = require('./swagger/openapi.json');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/photos', express.static(path.join(__dirname, 'public/photos')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', apiRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: err.message });
  }

  const { status = 500, message = 'Server error' } = err;
  res.status(status).json({ message });
});

module.exports = app;
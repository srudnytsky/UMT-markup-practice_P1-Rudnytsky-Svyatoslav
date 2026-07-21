const sequelize = require('../db/sequelize');
const Bouquet = require('./Bouquet');

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection successful');
    await sequelize.sync();
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB, Bouquet };
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Ensure environment variables are set correctly
const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT
} = process.env;


//debugging
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);


if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error('Missing one or more required database environment variables.');
}

// Initialize Sequelize instance
const sequelize = new Sequelize(DB_NAME!, DB_USER!, DB_PASSWORD, {
  host: DB_HOST,
  port: parseInt(DB_PORT || '3306'),  // Default MySQL port is 3306
  dialect: 'mysql',
  dialectModule: require('mysql2'),
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Test the database connection
export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({ alter: true });  // Use { force: true } only in development to drop and recreate tables
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);  // Exit the app if the connection fails
  }
};

export default sequelize;

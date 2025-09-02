import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hungerlinkdb',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('📝 Please ensure MySQL is running and credentials are correct');
    console.log('🔧 Update your .env file with valid database credentials');
  }
}

// Initialize database tables
async function initializeTables() {
  try {
    // Users table (for reference)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Donations table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        donor_id INT NOT NULL,
        type ENUM('food', 'money') NOT NULL,
        description TEXT,
        amount DECIMAL(10, 2) DEFAULT NULL,
        food_type VARCHAR(100) DEFAULT NULL,
        quantity VARCHAR(100) DEFAULT NULL,
        status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Marketplace table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS marketplace_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        quantity VARCHAR(100) NOT NULL,
        donor_id INT NOT NULL,
        status ENUM('available', 'claimed', 'expired') DEFAULT 'available',
        category VARCHAR(100),
        location VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (donor_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Rewards table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS user_rewards (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL UNIQUE,
        points INT DEFAULT 0,
        streak INT DEFAULT 0,
        badges JSON DEFAULT NULL,
        last_donation_date DATE DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing tables:', error.message);
  }
}

// Run initialization
testConnection();
initializeTables();

export default pool;
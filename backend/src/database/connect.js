const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const sql = require("mssql");

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 1433),
    options: {
        encrypt: true,              // required for Azure SQL
        trustServerCertificate: false,
    },
    pool: {
        max: 5,
        min: 0,
        idleTimeoutMillis: 30000,
    },
    requestTimeout: 30000,
};

let pool;

async function connectToDatabase() {
    if (pool) return pool;

    try {
        pool = await sql.connect(config);
        console.log("✅ Database connection established");
        return pool;
    } catch (err) {
        console.error("❌ Database connection failed");
        console.error(err.message);
        process.exit(1); // stop the app if DB is unreachable
    }
}

module.exports = { connectToDatabase };

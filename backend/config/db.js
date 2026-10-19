const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "campus_connect_hub"
});

pool.on("error", (err) => {
    console.error("❌ Unexpected PostgreSQL Pool Error:", err.message);
});

pool.query("SELECT 1", (err) => {
    if (err) {
        console.error("❌ PostgreSQL Connection Failed:", err.message);
    } else {
        console.log("✅ PostgreSQL Connected Successfully");
    }
});

// Convert unquoted MySQL ? placeholders to PostgreSQL $1, $2, etc.
function convertPlaceholders(sql) {
    let paramIndex = 1;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let result = "";

    for (let i = 0; i < sql.length; i++) {
        const char = sql[i];

        if (char === "'" && !inDoubleQuote) {
            if (inSingleQuote && sql[i + 1] === "'") {
                result += "''";
                i++;
                continue;
            }
            inSingleQuote = !inSingleQuote;
            result += char;
        } else if (char === '"' && !inSingleQuote) {
            if (inDoubleQuote && sql[i + 1] === '"') {
                result += '""';
                i++;
                continue;
            }
            inDoubleQuote = !inDoubleQuote;
            result += char;
        } else if (char === "?" && !inSingleQuote && !inDoubleQuote) {
            result += `$${paramIndex++}`;
        } else {
            result += char;
        }
    }

    return result;
}

// MySQL-compatible query wrapper for node-postgres
const query = (sql, params, callback) => {
    let actualParams = params;
    let actualCallback = callback;

    if (typeof params === "function") {
        actualCallback = params;
        actualParams = [];
    } else if (!actualParams) {
        actualParams = [];
    }

    const pgSql = convertPlaceholders(sql);

    pool.query(pgSql, actualParams, (err, res) => {
        if (err) {
            if (actualCallback) {
                return actualCallback(err, null);
            }
            return;
        }

        const rows = (res && res.rows) ? res.rows : [];
        rows.affectedRows = res ? res.rowCount : 0;
        rows.rowCount = res ? res.rowCount : 0;
        rows.fields = res ? res.fields : [];

        if (actualCallback) {
            actualCallback(null, rows);
        }
    });
};

module.exports = {
    query,
    pool
};
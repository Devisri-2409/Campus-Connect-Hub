const fs = require("fs");
const path = require("path");
const { Client } = require("pg");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function setup() {
  const baseConfig = {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD,
  };

  const dbName = process.env.DB_NAME || "campus_connect_hub";

  console.log(`🔌 Connecting to PostgreSQL at ${baseConfig.host}:${baseConfig.port} as ${baseConfig.user}...`);

  // Step 1: Connect to default postgres database to ensure target DB exists
  const rootClient = new Client({
    ...baseConfig,
    database: "postgres",
  });

  await rootClient.connect();

  const checkDbRes = await rootClient.query(
    "SELECT 1 FROM pg_database WHERE datname = $1",
    [dbName]
  );

  if (checkDbRes.rows.length === 0) {
    console.log(`📦 Creating fresh database "${dbName}"...`);
    await rootClient.query(`CREATE DATABASE "${dbName}"`);
    console.log(`✅ Database "${dbName}" created successfully!`);
  } else {
    console.log(`ℹ️ Database "${dbName}" already exists.`);
  }

  await rootClient.end();

  // Step 2: Connect to the campus_connect_hub database
  const targetClient = new Client({
    ...baseConfig,
    database: dbName,
  });

  await targetClient.connect();
  console.log(`🔗 Connected to database "${dbName}".`);

  // Step 3: Read and execute postgres_init.sql
  const sqlPath = path.join(__dirname, "..", "..", "database", "postgres_init.sql");
  console.log(`📄 Reading schema from ${sqlPath}...`);
  const schemaSql = fs.readFileSync(sqlPath, "utf8");

  console.log("⚡ Executing schema initialization script...");
  await targetClient.query(schemaSql);
  console.log("✅ Schema initialized successfully!");

  // Step 4: Verify tables and seed data
  const tablesRes = await targetClient.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `);

  console.log("\n📋 Installed Tables in campus_connect_hub:");
  for (const row of tablesRes.rows) {
    const countRes = await targetClient.query(`SELECT COUNT(*) as count FROM "${row.table_name}"`);
    console.log(`   - ${row.table_name}: ${countRes.rows[0].count} rows`);
  }

  await targetClient.end();
  console.log("\n🎉 Database setup and schema verification completed successfully!");
}

setup().catch((err) => {
  console.error("❌ Setup failed:", err.message);
  process.exit(1);
});


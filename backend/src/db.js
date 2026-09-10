const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');

let dbInstance = null;

async function getDB() {
    if (dbInstance) return dbInstance;

    const dbPath = path.join(__dirname, '..', 'kisan_niti.db');
    const isNew = !fs.existsSync(dbPath);

    dbInstance = await open({
        filename: dbPath,
        driver: sqlite3.Database
    });

    // Enable foreign keys
    await dbInstance.run('PRAGMA foreign_keys = ON;');

    if (isNew) {
        console.log('📦 Initializing new KisanNiti database from schema and seed files...');
        try {
            const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
            const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');

            if (fs.existsSync(schemaPath)) {
                let schemaSql = fs.readFileSync(schemaPath, 'utf8');
                // Clean MySQL specific constraints for SQLite compatibility
                schemaSql = schemaSql.replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/g, 'DATETIME DEFAULT CURRENT_TIMESTAMP');
                await dbInstance.exec(schemaSql);
                console.log('✅ Database schema created successfully.');
            }

            if (fs.existsSync(seedPath)) {
                let seedSql = fs.readFileSync(seedPath, 'utf8');
                await dbInstance.exec(seedSql);
                console.log('✅ Database seeded with demo Maharashtra agri data.');
            }
        } catch (err) {
            console.error('❌ Database initialization error:', err.message);
        }
    } else {
        console.log('✅ Connected to existing KisanNiti SQLite database.');
    }

    return dbInstance;
}

module.exports = { getDB };

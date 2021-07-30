const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
    console.log('Connection done!');
});


module.exports = {
    async query(text, params) {
        try {
            const res = await pool.query(text, params);
            return res;
        } catch (error) {
            console.log('error in query', { text });
            throw error;
        }
    }
};
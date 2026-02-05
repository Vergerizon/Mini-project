// migrate_add_default_password.js
// Script untuk mengisi password default pada user lama yang belum punya password
const { pool } = require('./database/config');
const bcrypt = require('bcryptjs');

async function migrate() {
    const defaultPassword = 'changeme';
    const hashed = await bcrypt.hash(defaultPassword, 10);
    // Cari user yang password-nya NULL atau kosong
    const [users] = await pool.query("SELECT id FROM users WHERE password IS NULL OR password = ''");
    for (const user of users) {
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, user.id]);
        await pool.query('INSERT INTO hashpassword (user_id, hash) VALUES (?, ?)', [user.id, hashed]);
        console.log(`User ID ${user.id} updated with default password.`);
    }
    if (users.length === 0) {
        console.log('No users need migration.');
    } else {
        console.log('Migration complete. Default password: changeme');
    }
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration error:', err);
    process.exit(1);
});

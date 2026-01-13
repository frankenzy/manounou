// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//     connectionString: process.env.DATABASE_URL,
// });

// module.exports = {
//     query: (text:string, params:string) => pool.query(text, params),
// };



// import sqlite3 from 'sqlite3';
// import { open } from 'sqlite';

// const getDbConnection = async () => {
//   return open({
//     filename: './database.db', // Path where your SQLite database file is located
//     driver: sqlite3.Database,
//   });
// };

export default getDbConnection;
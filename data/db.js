import mysql from 'mysql2/promise'

const conn = {
    host:'localhost',
    port:3306,
    database:'mozi',
    password:'',
    user:'root'
}

const db = await mysql.createPool(conn);
export default db;
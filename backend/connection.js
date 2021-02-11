import mysql from 'mysql';
import dbconfig from './dbconfig'

var mysqlConnection = mysql.createPool(dbconfig);

module.exports = mysqlConnection;
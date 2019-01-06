//TODO

const express = require('express');
const mysql = require('mysql');

// Create connection
let db = mysql.createConnection({
	host	: '',
	user	: '',
	password: '',
        database: ''
});

db.connect((err) => {
  if(err) {
    console.log("SQL CONNECT ERROR!");
    throw err;
  }
  console.log('MySqlConnected...');
});

module.exports.db = db;
module.exports.db.credentials = {
	host	: '',
	user	: '',
	password: '',
        database: ''
}

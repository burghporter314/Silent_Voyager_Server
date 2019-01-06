const mysql = require('mysql');

module.exports = {

  createDatabase : function(db, name) {
    let sql = 'CREATE DATABASE ' + name;
    db.query(sql, (err, result) => {

      if(err) return;
      console.log(result);
      console.log("Database Created");

    });
  },

  query : function(db, sql) {
    db.query(sql, (err, result) => {

      if(err) return;
      console.log(result);
      console.log("QUERY EXECUTED");

      return result;

    });
  }

};

const mysql = require('mysql');
var database = require("../scripts/SQLConnection");
var SQLOP = require("../scripts/SQLOperation");

module.exports = {

  checkCredentials : function(username, password, callback) {

    let sql = "SELECT A1.Username, Password FROM SilentVoyagerUsernames " + 
			"AS A1 INNER JOIN SilentVoyagerPasswords AS A2 ON A1.Username" + 
			" = A2.Username WHERE A1.Username='"+username+"' AND Password='" 
	  		+ password + "';";

    let query = database.db.query(sql, (err, results) => {
      if(err) throw err;
      callback(results);
    });

  },

  checkIfUserExists : function(username, email, callback) {

    let sql = "SELECT Username FROM SilentVoyagerUsernames WHERE Username='" + username + "';";
    let sql2 = "SELECT Email FROM SilentVoyagerEmails WHERE Email='" + email + "';";

    let query = database.db.query(sql, (err, results) => {

      if(err) throw err;
  
      if(results.length > 0) { callback(false, "Username already exists"); return; }

      let query2 = database.db.query(sql2, (err, results) => {

        if(err) throw err;
        console.log(sql2);
        if(results.length > 0) { callback(false, "Email already exists"); return; }
        callback(true, "");

      });

    });
  },

  getNonParameterizedQueryResults : function(username, callback) {
    
    let sql = "SELECT * FROM SilentVoyagerCoordinates WHERE Username='" + username + "';";
    let query = database.db.query(sql, (err, results) => {

      if(err) throw err;
      callback(results);

    });
    
  }

};

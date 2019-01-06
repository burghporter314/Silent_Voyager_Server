var express = require('express');
var router = express.Router();

var database = require("../scripts/SQLConnection");
var SQLOP = require("../scripts/SQLOperation");
var verification = require("../scripts/Verification");

router.post('/add_coordinates', function(req, res, next) {
  
  if(!(req.body["username"] && req.body["password"])) {

    res.write("INVALID");
    res.send();

  } else {

    verification.checkCredentials(req.body.username, req.body.password, (results) => {

      if(results.length > 0) { 

	res.write("VALID"); 

	let sql = "INSERT INTO SilentVoyagerCoordinates (Username, Latitude, Longitude,"
						+" Altitude, City, DateStamp, Year, "
						+"Month, Day, Hour, Minute, Second) VALUES ('" 
						+ (req.body["username"]  || "") + "', '" 
						+ (req.body["latitude"]  || "") + "', '" 
						+ (req.body["longitude"] || "") + "', '" 
						+ (req.body["altitude"]  || "") + "', '" 
						+ (req.body["city"]      || "") + "', '" 
						+ (req.body["datestamp"] || "") + "', '" 
						+ (req.body["year"]      || "") + "', '" 
						+ (req.body["month"]     || "") + "', '" 
						+ (req.body["day"]       || "") + "', '" 
						+ (req.body["hour"]      || "") + "', '" 
						+ (req.body["minute"]    || "") + "', '" 
						+ (req.body["second"]    || "") + "');";

	database.db.query(sql, (err, results) =>  {if(err) throw err; /*TODO*/});

      } 
      else { res.write("INVALID"); }
  
      res.send();

    });

  }
});

router.post('/add_user', function(req, res, next) {

  if(!(req.body["name"] && req.body["username"] && req.body["email"] 
		&& req.body["password"] && req.body["confirmpassword"])) {
    res.write("Please fill out all fields");
    res.send();

  } else {

    verification.checkIfUserExists(req.body.username, req.body.email, (indicator, resultsMsg) => {

      if(indicator) { 

	let sql = "INSERT INTO SilentVoyagerUsernames (Username) VALUES ('" 
						+ req.body["username"] + "');";

	let sql2 = "INSERT INTO SilentVoyagerEmails (Username, Email) VALUES ('" 
						+ req.body["username"] + "', '" 
						+ req.body["email"]+ "');";

	let sql3 = "INSERT INTO SilentVoyagerNames (Username, Name) VALUES ('" 
						+ req.body["username"] + "', '" 
						+ req.body["name"]+ "');";

	let sql4 = "INSERT INTO SilentVoyagerPasswords (Username, Password) VALUES ('"
						+ req.body["username"] + "', '" 
						+ req.body["password"]+ "');";

	database.db.query(sql, (err, results) =>  {if(err) throw err; /*TODO*/});
	database.db.query(sql2, (err, results) => {if(err) throw err; /*TODO*/});
	database.db.query(sql3, (err, results) => {if(err) throw err; /*TODO*/});
	database.db.query(sql4, (err, results) => {if(err) throw err; /*TODO*/});

	res.write("VALID"); 

      }

      else { res.write(resultsMsg); }

      res.send();

    });

  }

});

router.post('/validate_credentials', function(req, res, next) {

  if(!(req.body["username"] && req.body["password"])) {

    res.write("INVALID");
    res.send();

  } else {

    verification.checkCredentials(req.body.username, req.body.password, (results) => {

      if(results.length > 0) { res.write("VALID"); } 
      else { res.write("INVALID"); }
  
      res.send();

    });
  }

});

router.post('/get_results', function(req, res, next) {

  if(!(req.body["username"] && req.body["password"])) {

    res.write("INVALID");
    res.send();

  } else {
    verification.checkCredentials(req.body.username, req.body.password, (results) => {
      if(results.length > 0) { 
        verification.getNonParameterizedQueryResults(req.body["username"], (results) => {
          console.log(results);
          for(i = 0; i < results.length; i++) {
            res.write(results[i]["Username"]+",");
            res.write(results[i]["Latitude"]+",");
            res.write(results[i]["Longitude"]+",");
            res.write(results[i]["Altitude"]+",");
            res.write(results[i]["City"]+",");
            res.write(results[i]["DateStamp"]+"\n");
          }
          res.send();
        });
      } else { res.write("INVALID"); res.send();}

    });
  }

});

module.exports = router;



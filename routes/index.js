var express = require('express');
var router = express.Router();

var database = require("../scripts/SQLConnection");
var SQLOP = require("../scripts/SQLOperation");
var verification = require("../scripts/Verification");
var moment = require('moment');

var relURL = "/";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { msg: req.query["msg"] });
});

router.post('/login', function(req, res, next) {

  if(!(req.body["username"] && req.body["pwd"]) && !(req.session["username"] 
				&& req.session["pwd"])) {
    
    res.writeHead(302, {
      'Location': relURL+"?msg=ERROR: Please Login Again."
    });

    res.end();

  } else {

    var username, pwd;

    if(!(req.body["username"] && req.body["pwd"]) || req.body["username"] === "undefined") {
      username = req.session.username;
      pwd = req.session.pwd;
    } else {
      username = req.body["username"];
      pwd = req.body["pwd"];
    }

    verification.checkCredentials(username, pwd, (results) => {

      req.session.username = username;
      req.session.pwd = pwd;

      if(results.length > 0) {

        startDate = moment(new Date(req.body["date_begin"])).format("YYYY_MM_DD_HH_mm_SS");
        endDate = moment(new Date(req.body["date_end"])).format("YYYY_MM_DD_HH_mm_SS");

        verification.getNonParameterizedQueryResults(username, (results) => {
          res.render("login", {  
                startDateStringNormalized: req.body["date_begin"],
                endDateStringNormalized: req.body["date_end"],
                startDateString: startDate,
                endDateString: endDate,
  		resultsArr: JSON.stringify(results) 
	  });
        });

      } else {
        res.writeHead(302, {
          'Location': relURL+"?msg=ERROR: Invalid Credentials"
        });
    	res.end();

      }
    });
  }

});

module.exports = router;

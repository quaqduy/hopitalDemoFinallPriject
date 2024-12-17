var express = require('express');
var router = express.Router();

/* GET docter home page. */
router.get('/', function(req, res, next) {
  res.render('doctor');
});

module.exports = router;

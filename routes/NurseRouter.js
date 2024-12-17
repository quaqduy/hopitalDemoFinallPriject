var express = require('express');
var router = express.Router();

/* GET nurse home page. */
router.get('/', function(req, res, next) {
  res.render('nurse');
});

module.exports = router;

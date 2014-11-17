var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

router.get('/', function(req, res) {
  res.render('home', {
    title: 'General Store',
    metaDescription: 'General ecommerce store',
    alias: 'home'
  });
});

module.exports = router;
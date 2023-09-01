"use strict";

var express = require('express');

var cors = require('cors');

var Moralis = require('moralis')["default"];

var PORT = process.env.PORT || 3000;

require('dotenv').config(); // ENV vars


var MORALIS_API_KEY = process.env.MORALIS_API_KEY;
var app = express(); // set static folder

app.use(express["static"]('public')); // routes

app.use('/token-holders', require('./routes/token-holders'));
app.use('/token-balance', require('./routes/token-balance'));
app.use('/snapshot-api', require('./routes/snapshot-api')); // eneble cors

app.use(cors());
Moralis.start({
  apiKey: MORALIS_API_KEY
}).then(function () {
  app.listen(PORT, function () {
    console.log("Server listening on port ".concat(PORT));
  });
});
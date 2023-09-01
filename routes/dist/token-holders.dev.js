"use strict";

var express = require('express');

var router = express.Router(); // const needle = require('needle')

var Moralis = require('moralis')["default"];

var apicache = require('apicache'); // ENV vars


var GOERLI_ADDRESS = process.env.GOERLI_ADDRESS;
var CHAIN = process.env.CHAIN; // init cache

var cache = apicache.middleware;
router.get('/', cache('2minutes'), function _callee(req, res) {
  var apiRes, data;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Moralis.EvmApi.token.getWalletTokenBalances({
            "chain": CHAIN,
            "address": GOERLI_ADDRESS
          }));

        case 3:
          apiRes = _context.sent;
          data = apiRes.raw;
          res.status(200).json(data);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: _context.t0.message
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
});
module.exports = router;
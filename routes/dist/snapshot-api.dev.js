"use strict";

var express = require('express');

var router = express.Router();

var fetch = require('node-fetch');

var apicache = require('apicache'); // ENV vars


var SNAPSHOT_PATH = process.env.SNAPSHOT_PATH;
var SNAPSHOT_SPACE = process.env.SNAPSHOT_SPACE;
router.post('/', function _callee(req, res) {
  var proposalsIds, apiRes, apiRes2, apiData, apiData2, finalData;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          proposalsIds = [];
          _context.next = 4;
          return regeneratorRuntime.awrap(fetch(SNAPSHOT_PATH, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: "\n                    query Proposal {\n                        proposals(\n                            first: 20,\n                            skip: 0,\n                            where: {\n                                space: \"".concat(SNAPSHOT_SPACE, "\"\n                            },\n                            orderBy: \"created\",\n                            orderDirection: desc\n                        ) {\n                            id\n                            title\n                            body\n                            choices\n                            start\n                            end\n                            snapshot\n                            state\n                            author\n                            space {\n                                id\n                                name\n                            }\n                        }\n                    }\n                ")
            })
          }));

        case 4:
          apiRes = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(fetch(SNAPSHOT_PATH, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: "\n                    query Votes {\n                        votes (\n                            first: 1000\n                            skip: 0\n                            where: {\n                                space: \"".concat(SNAPSHOT_SPACE, "\"\n                            }\n                            orderBy: \"created\",\n                            orderDirection: desc\n                        ) {\n                            id\n                            voter\n                            vp\n                            vp_by_strategy\n                            vp_state\n                            created\n                            proposal {\n                                id\n                            }\n                            choice\n                            space {\n                                id\n                            }\n                        }\n                    }\n                ")
            })
          }));

        case 7:
          apiRes2 = _context.sent;
          _context.next = 10;
          return regeneratorRuntime.awrap(apiRes.json());

        case 10:
          apiData = _context.sent;
          _context.next = 13;
          return regeneratorRuntime.awrap(apiRes2.json());

        case 13:
          apiData2 = _context.sent;
          finalData = {
            apiData: apiData,
            apiData2: apiData2
          };
          res.status(200).json(finalData);
          _context.next = 21;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: _context.t0.message
          });

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 18]]);
});
module.exports = router;
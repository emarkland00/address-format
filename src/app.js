"use strict";
exports.__esModule = true;
var init_app_1 = require("./init-app");
var net_1 = require("./lib/net");
// enable loading from process.ENV
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
// execution script
var port = (0, net_1.normalizePort)(process.env.PORT || 3000);
var app = (0, init_app_1.createApp)(port);
var shutdownServer = (0, init_app_1.startServer)(app, port);
process.on('SIGINT', shutdownServer);
exports["default"] = app;

"use strict";
exports.__esModule = true;
var express_1 = require("./config/express");
var port = process.env.PORT || 3000;
express_1["default"].listen(port, function (err) {
    if (err) {
        return console.log(err);
    }
    return console.log("server is listening on " + port);
});

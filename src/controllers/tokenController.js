"use strict";
exports.__esModule = true;
var jwt = require("jsonwebtoken");
exports.check = function (req) {
    var token = req.headers["x-access-token"];
    if (!token)
        return false;
    try {
        jwt.verify(token, 'developmentTokenSecret');
        return true;
    }
    catch (err) {
        return false;
    }
};

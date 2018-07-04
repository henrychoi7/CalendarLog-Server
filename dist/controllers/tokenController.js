"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
exports.check = function (req) {
    const token = req.headers["x-access-token"];
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
//# sourceMappingURL=tokenController.js.map
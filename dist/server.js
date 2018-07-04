"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("./config/express");
const port = process.env.PORT || 3000;
express_1.default.listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log(`server is listening on ${port}`);
});
//# sourceMappingURL=server.js.map
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const prisma_1 = require("./prisma");
/**
 * Handles basic authorization. Clients are expected to provide a
 * "user" object in the request body, with a name and password. That
 * data is then compared.
 */
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = JSON.parse(req.headers.user);
    if (userData && userData.name && userData.password) {
        const user = yield (0, prisma_1.query)(res, db => db.user.findFirst({ where: {
                name: userData.name
            } }));
        if (!user) return res;
        if (user.password == userData.password) {
            req.userId = user.id;
            return next();
        }
    }
    return res.status(401).send("Please provide authorized user to interact with server.");
});
exports.verifyToken = verifyToken;
//# sourceMappingURL=auth-middleware.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
exports.router = router;
// The verify process is handled via the auth middleware.
// So to verify, return OK 200
router.get("/verify", controller_1.verify);
// POST picture
router.post("/upload-picture", controller_1.postPicture);
// GET answers
router.post("/get-answers", controller_1.getAnswers);
// POST answer
router.post("/submit-answer", controller_1.postAnswer);
// GET trivia
router.get("/get-trivia", controller_1.getTrivia);
//# sourceMappingURL=router.js.map
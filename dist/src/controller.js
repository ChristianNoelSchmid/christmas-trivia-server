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
exports.getTrivia = exports.postAnswer = exports.postPicture = exports.getAnswers = exports.verify = void 0;
const fs_1 = require("fs");
const array_1 = require("./array");
const prisma_1 = require("./prisma");
const QUESTION_COUNT = 3;
const fileTypes = ['png', 'jpg', 'jpeg', 'gif'];
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, prisma_1.query)(res, db => db.user.findFirst({
        where: { id: req.userId },
        include: { Answer: {
                orderBy: { qIndex: "asc" }
            } }
    }));
    if (user) {
        return res.status(200).json(user);
    }
});
exports.verify = verify;
const getAnswers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const answers = yield (0, prisma_1.query)(res, db => db.answer.findMany({
        where: { userId: req.userId },
        orderBy: { qIndex: "asc" }
    }));
    if (answers)
        return res.status(200).json(answers);
});
exports.getAnswers = getAnswers;
const postPicture = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!((_a = req.files) === null || _a === void 0 ? void 0 : _a.picture)) {
        console.log("File must be uploaded.");
        return res.status(400).send("File must be uploaded");
    }
    else {
        const picture = req.files.picture;
        // Check if the mimetype is a supported image file
        if (!fileTypes.some(f => picture.mimetype == `image/${f}`)) {
            console.log("Unsupported filetype uploaded: " + picture.mimetype);
            return res.status(400).send("Please upload a supported filetype (.png, .jpg, .jpeg, or .gif)");
        }
        // Retrieve the user, and check if they have already uploaded
        // an image. If so, delete it before uploading this one
        const user = yield (0, prisma_1.query)(res, db => db.user.findFirst({
            where: { id: req.userId }
        }));
        if (!user)
            return;
        if (user.pictureUrl) {
            (0, fs_1.unlink)('./public/pictures/' + user.pictureUrl, err => {
                if (err)
                    console.log(err.message);
                else
                    console.log(user.pictureUrl + " deleted");
            });
        }
        const filename = `${req.userId}_${picture.name}`;
        picture.mv(`./public/pictures/${filename}`);
        const updatedUser = yield (0, prisma_1.query)(res, db => db.user.update({
            where: { id: req.userId },
            data: { pictureUrl: filename }
        }));
        if (updatedUser)
            return res.status(200).json({ url: filename });
    }
});
exports.postPicture = postPicture;
const postAnswer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const answer = req.body.answer;
    if (answer != undefined &&
        answer.qIndex != undefined &&
        answer.choice != undefined) {
        yield (0, prisma_1.query)(res, (db) => db.answer.upsert({
            where: { userId_qIndex: {
                    userId: req.userId,
                    qIndex: answer.qIndex
                } },
            update: {
                choice: answer.choice
            },
            create: {
                userId: req.userId,
                qIndex: answer.qIndex,
                choice: answer.choice
            }
        }));
        return yield Promise.resolve(setTimeout(() => res.status(200).send({ msg: "Answer saved." }), 500));
    }
    return res.status(400).send("Please provide an answer, with qIndex and choice.");
});
exports.postAnswer = postAnswer;
/**
 * Retrieves a new trivia, created using a random-order
 * sequence of users, and retrieving their answers
 */
const getTrivia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Retrieve all users and their answers
    const users = yield (0, prisma_1.query)(res, db => db.user.findMany({
        where: { id: { not: req.userId } },
        include: { Answer: true }
    }));
    if (!users)
        return;
    (0, array_1.shuffle)(users);
    const answers = [];
    let j = 0;
    for (let i = 0; i < QUESTION_COUNT; ++i) {
        let answer = null;
        // Increments whenever a user does not have the answer to the current
        // test.
        let cycleRepeat = 0;
        // Cycle through the shuffled users until one with the
        // current answer is found
        do {
            cycleRepeat += 1;
            // If no user has the answer (ie. cycleRepeat > user.length), return 400
            if (cycleRepeat > users.length) {
                return res.status(400).send("Not enough user tests yet. Please try again later.");
            }
            const user = (0, array_1.cycleGet)(users, j);
            answer = user.Answer.find(answer => answer.qIndex == i);
            j += 1;
        } while (!answer);
        answers.push(answer);
    }
    return res.status(200).json(answers);
});
exports.getTrivia = getTrivia;
//# sourceMappingURL=controller.js.map
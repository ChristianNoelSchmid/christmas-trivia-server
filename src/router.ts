import { Router } from "express";

import { getAnswers, postAnswer, getTrivia, verify, postPicture } from "./controller";

const router = Router();

// The verify process is handled via the auth middleware.
// So to verify, return OK 200
router.get("/verify", verify);

// POST picture
router.post("/upload-picture", postPicture);

// GET answers
router.post("/get-answers", getAnswers);

// POST answer
router.post("/submit-answer", postAnswer);

// GET trivia
router.get("/get-trivia", getTrivia);

export { router };

import { Router } from "express";

import { getAnswers, postAnswer, getTrivia, verify, postPicture, postSecretSantaGift, postCreatureRating, getCreatureResults, getUsers, setupSecretSantas } from "./controller";

const router = Router();

// The verify process is handled via the auth middleware.
// So to verify, return OK 200
router.get("/verify", verify);

router.get("/users", getUsers);

// POST picture
router.post("/upload-picture", postPicture);

// GET answers
router.post("/get-answers", getAnswers);

// POST answer
router.post("/submit-answer", postAnswer);

// GET trivia
router.get("/get-trivia", getTrivia);

// POST secret Santa gift
router.post("/secret-santa-gift", postSecretSantaGift);

// POST creature rating
router.post("/creature-rating", postCreatureRating);

router.get("/creature-results", getCreatureResults);

router.post("/setup-santas", setupSecretSantas);

export { router };

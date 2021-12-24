import { Answer, User } from '@prisma/client';
import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { unlink } from 'fs';
import { capitalize, cycleGet, shuffle } from './array';

import { db } from './prisma';
import { Trivia, TriviaQuestion, TRIVIA_QUESTIONS } from './trivia-generator';

const QUESTION_COUNT = 10;
const fileTypes = ['png', 'jpg', 'jpeg', 'gif'];

const verify = async (req: Request, res: Response) => {
    const user = await db.user.findFirst({
        where: { id: req.userId },
        include: { 
            answers: { orderBy: { qIndex: "asc" } },
            usersToCreatureRates: true,
        }
    });

    user.usersToCreatureRates = await db.userToCreature.findMany({
        where: { raterId: req.userId },
        orderBy: { ratedId: "asc" }
    });


    return res.status(200).json(user);
}

const getUsers = async (req: Request, res: Response) => {
    const users = await db.user.findMany({
        where: { NOT: { id: req.userId } }     
    });
    return res.status(200).json(users);
}

const getAnswers = async (req: Request, res: Response) => {
    const answers = await db.answer.findMany({
        where: { userId: req.userId },
        orderBy: { qIndex: "asc" }
    });
    if(answers) {
        return res.status(200).json(answers);
    } else {
        return res.status(500).send("Server error. Please try again later.");
    }
}

const postPicture = async (req: Request, res: Response) => {

    if(!req.files?.picture) {
        console.log("File must be uploaded.");
        return res.status(400).send("File must be uploaded");

    } else {
        const picture = req.files.picture as UploadedFile;
        
        // Check if the mimetype is a supported image file
        if(!fileTypes.some(f => picture.mimetype == `image/${f}`)) {
            console.log("Unsupported filetype uploaded: " + picture.mimetype);
            return res.status(400).send("Please upload a supported filetype (.png, .jpg, .jpeg, or .gif)");
        }

        // Retrieve the user, and check if they have already uploaded
        // an image. If so, delete it before uploading this one
        const user = await db.user.findFirst({
            where: { id: req.userId }
        });

        if(!user) {
            return res.status(500).send("Server error. Please try again later.");
        }
        
        if(user.pictureUrl) {
            unlink('./public/pictures/' + user.pictureUrl, err => {
                if(err) console.log(err.message);
                else console.log(user.pictureUrl + " deleted");
            });
        }

        const filename = `${req.userId}_${picture.name}`;
        picture.mv(`./public/pictures/${filename}`);

        const updatedUser = await db.user.update({
            where: { id: req.userId },
            data: { pictureUrl: filename }
        });
        
        if(updatedUser) {
            return res.status(200).json({ url: filename });
        }
    }
};

const postAnswer = async (req: Request, res: Response) => {
    const answer = req.body.answer;

    if(
        answer != undefined && 
        answer.qIndex != undefined && 
        answer.choice != undefined
    ) {
        await db.answer.upsert({
            where: { userId_qIndex: {
                userId: req.userId,
                qIndex: answer.qIndex
            } },
            update: {
                choice: capitalize(answer.choice)
            },
            create: {  
                userId: req.userId,
                qIndex: answer.qIndex,
                choice: capitalize(answer.choice)
            }
        });

        return res.status(200).send({ msg: "Answer saved" });
    }

    return res.status(400).send("Please provide an answer, with qIndex and choice.");
}


const postSecretSantaGift = async (req: Request, res: Response) => {
    const gift = req.body.gift;

    if(gift != undefined) {
        const user = await db.user.update({ 
            where: { id: req.userId },
            data: { secretSantaGift: gift }
        });

        if(user != null) {
            return res.status(200).send({ msg: "Secret Santa gift saved" });
        } else {
            return res.status(500).send("Server error. Please try again later.");
        }
    };

    return res.status(400).send("Please provide a value for the gift");
}

const postCreatureRating = async (req: Request, res: Response) => {
    const rating = req.body;
    if(rating.ratedId != undefined && rating.creatureIndex != undefined) {
        await db.userToCreature.upsert({
            where: { 
                raterId_ratedId: {
                    raterId: req.userId,
                    ratedId: rating.ratedId
                }
            },
            update: {
                creatureIndex: rating.creatureIndex,
            },
            create: {
                raterId: req.userId,
                ratedId: rating.ratedId,
                creatureIndex: rating.creatureIndex
            }
        });

        return res.status(200).send({ msg: "Creature rating saved." });
    }

    return res.status(400).send("Please provide a rating with a ratedId and creatureIndex");
}


/**
 * Retrieves a new trivia, created using a random-order
 * sequence of users, and retrieving their answers
 */
const getTrivia = async(req: Request, res: Response) => {
    // Retrieve all users and their answers
    const users = await db.user.findMany({
        where: { id: { not: req.userId } },
        include: { answers: true }
    });

    if(users) {
        shuffle(users);

        const triviaQuestions: TriviaQuestion[] = [];
        const creaturePoints: number[] = [0, 0, 0, 0];
        let uIndex = 0;

        for(let i = 0; i < QUESTION_COUNT; ++i) {
            let answer = null;
            let user = null;
            // Increments whenever a user does not have the answer to the current
            // test.
            let cycleRepeat = 0;
            // Cycle through the shuffled users until one with the
            // current answer is found
            do {
                cycleRepeat += 1;
                // If no user has the answer (ie. cycleRepeat > user.length), return 400
                if(cycleRepeat > users.length) {
                    return res.status(400).send("Not enough user tests yet. Please try again later.");
                }
                
                user = cycleGet(users, uIndex);
                answer = user.answers.find(answer => answer.qIndex == i);
                uIndex += 1;
            } while(!answer);

            let triviaQuestion = _generateTriviaQuestion(answer, user);
            triviaQuestions.push(triviaQuestion);
        }

        const userToCreatures = await db.userToCreature.findMany({
            where: { ratedId: req.userId }
        });
            
        userToCreatures.forEach(utc => creaturePoints[utc.creatureIndex] += 1);

        const secretSanta = await db.user.findFirst({
            where: { toGiftId: req.userId }
        });

        return res.status(200).json({
            triviaQuestions: triviaQuestions,
            secretSantaGifter: secretSanta.name, 
            secretSantaGifterPictureUri: secretSanta.pictureUrl,
            secretSantaGift: secretSanta.secretSantaGift,
            creaturePoints: creaturePoints
        } as Trivia);
    }
}

const getCreatureResults = async(req: Request, res: Response) => {
    const creatureResults = [0, 0, 0, 0];
    (await db.userToCreature.findMany({
        where: { ratedId: req.userId },
    })).forEach(value => creatureResults[value.creatureIndex] += 1);

    return res.status(200).json(creatureResults);
}

const setupSecretSantas = async(req: Request, res: Response) => {
    const secret = req.body.secret;

    if(secret == process.env.SS_SECRET) {
        const users1 = await db.user.findMany();
        const users2 = [];

        users1.forEach(u => users2.push(u));
        shuffle(users2);

        while(users1.length > 0) {
            const next1 = users1.pop();
            let next2; if(users2[users2.length - 1].id == next1.id) {
                next2 = users2.splice(1, 1)[0];
            } else {
                next2 = users2.pop();
            }
        
            await db.user.update({
                where: { id: next1.id },
                data: { toGiftId: next2.id }
            });
        }

        return res.status(200).send("Secret santas setup!");
    } else {
        res.status(401).send("Incorrect secret");
    }
}

export { verify, getUsers, getAnswers, postPicture, postAnswer, getTrivia, postSecretSantaGift, postCreatureRating, getCreatureResults, setupSecretSantas };

function _generateTriviaQuestion(answer: Answer, user: User): TriviaQuestion {
    const values = [];
    const question = TRIVIA_QUESTIONS[answer.qIndex];
    if (question.type == "word") {
        values.push(answer.choice);
        let options = []; 
        TRIVIA_QUESTIONS[answer.qIndex].options.forEach(option => options.push(option));

        while (values.length < 4) {
            const chosen = options[Math.floor(Math.random() * options.length)];
            if (chosen != answer.choice) {
                values.push(chosen);
                options.splice(options.indexOf(chosen), 1);
            }
        }

        shuffle(values);
    } else if (question.type == "boolean") {
        values.push("True");
        values.push("False");
    } else {
        TRIVIA_QUESTIONS[answer.qIndex].options.forEach(option => {
            values.push(option);
        });
    }

    const answerIndex = values.indexOf(answer.choice);

    return {
        qIndex: answer.qIndex,
        questionerName: user.name,
        questionerPictureUri: user.pictureUrl,
        values: values,
        answerIndex: answerIndex,
    };
}

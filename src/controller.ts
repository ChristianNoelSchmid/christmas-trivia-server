import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import { unlink } from 'fs';
import { cycleGet, shuffle } from './array';

import { query } from './prisma';

const QUESTION_COUNT = 3;
const fileTypes = ['png', 'jpg', 'jpeg', 'gif'];

const verify = async (req: Request, res: Response) => {
    const user = await query(res, db => 
        db.user.findFirst({
            where: { id: req.userId },
            include: { Answer: {
                orderBy: { qIndex: "asc" }
            } }
        })
    );

    if(user) {
        return res.status(200).json(user);
    }
}

const getAnswers = async (req: Request, res: Response) => {
    const answers = await query(res, db => 
        db.answer.findMany({
            where: { userId: req.userId },
            orderBy: { qIndex: "asc" }
        })
    );

    if(answers) 
        return res.status(200).json(answers);
};


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
        const user = await query(res, db => 
            db.user.findFirst({
                where: { id: req.userId }
            })
        );

        if(!user) return;
        
        if(user.pictureUrl) {
            unlink('./public/pictures/' + user.pictureUrl, err => {
                if(err) console.log(err.message);
                else console.log(user.pictureUrl + " deleted");
            });
        }
        const filename = `${req.userId}_${picture.name}`;
        picture.mv(`./public/pictures/${filename}`);

        const updatedUser = await query(
            res, db => 
            db.user.update({
                where: { id: req.userId },
                data: { pictureUrl: filename }
            })
        );
        
        if(updatedUser)
            return res.status(200).json({ url: filename });
    }
};

const postAnswer = async (req: Request, res: Response) => {
    const answer = req.body.answer;

    if(
        answer != undefined && 
        answer.qIndex != undefined && 
        answer.choice != undefined
    ) {
        await query(res, (db) => 
            db.answer.upsert({
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

            return await Promise.resolve(setTimeout(() => res.status(200).send({ msg: "Answer saved." }), 500));
    }

    return res.status(400).send("Please provide an answer, with qIndex and choice.");
}


/**
 * Retrieves a new trivia, created using a random-order
 * sequence of users, and retrieving their answers
 */
const getTrivia = async(req: Request, res: Response) => {
    // Retrieve all users and their answers
    const users = await query(res, db => db.user.findMany({
        where: { id: { not: req.userId } },
        include: { Answer: true }
    }));

    if(!users) return;

    shuffle(users);

    const answers = [];
    let j = 0;

    for(let i = 0; i < QUESTION_COUNT; ++i) {
        let answer = null;
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
            
            const user = cycleGet(users, j);
            answer = user.Answer.find(answer => answer.qIndex == i);
            j += 1;
        } while(!answer);

        answers.push(answer);
    }

    return res.status(200).json(answers);
}

export { verify, getAnswers, postPicture, postAnswer, getTrivia };
const TRIVIA_QUESTIONS = [{
    type: "word", // What is your favorite Christmas movie?
    options: [
        "Elf",
        "White Christmas",
        "Rudolph The Red-nosed Reindeer",
        "The Polar Express",
        "A Charlie Brown Christmas"
    ]
}, {
    type: "word", // What is your favorite Christmas beverage?
    options: [
        "Egg Nog",
        "Peppermint Mocha",
        "Apple Cider",
        "Hot Chocolate",
        "Peppermint Hot Chocolate"
    ]
}, {
    type: "word", // What is your favorite Christmas song?
    options: [
        "Chesnuts Roasting On An Open Fire",
        "All I Want For Christmas Is You",
        "Last Christmas",
        "I'll Be Home For Christmas",
        "Let It Snow, Let It Snow, Let It Snow"
    ],
}, {
    type: "word", // What is your favorite Christmas treat?
    options: [
        "Peanut Brittle",
        "Peppermint Bark",
        "Peanut Butter Fudge",
        "Almond Brittle",
        "Fudge"
    ]
}, {
    type: "boolean" // True or false: you like knowing what you're getting for Christmas beforehand.
}, {
    type: "boolean" // True or false: you like to wear ugly Christmas sweaters.
}, {
    type: "choice", // When do you put up your Christmas decorations?
    options: [
        "Before Thanksgiving", 
        "After Thanksgiving", 
        "I don't decorate", 
        "I never take them down!"
    ]
}, {
    type: "boolean" // True or false: you enjoy holiday shopping.
}, {
    type: "choice", // In all honesty, real or fake tree?
    options: [
        "Real!",
        "Fake!"
    ]
}, {
    type: "choice", // An elf position opens at the North Pole. Which position do you apply for?
    options: [
        "Reindeer feeder / mucker", 
        "Present maker / wrapper", 
        "Sleigh maintenance", 
        "Yikes, no thanks"
    ]
}];

interface Trivia {
    triviaQuestions: TriviaQuestion[],
    secretSantaGifter: string,
    secretSantaGifterPictureUri: string,
    secretSantaGift: string,
    creaturePoints: number[]
}

interface TriviaQuestion {
    qIndex: number, // The index of the question
    questionerName: string, // The name of the individual who answered the question
    questionerPictureUri: string, // The URI of the individual's picture
    values: string[], // The values given in the trivia question
    answerIndex: number, // The answer in the question
}

export { TRIVIA_QUESTIONS, TriviaQuestion, Trivia };
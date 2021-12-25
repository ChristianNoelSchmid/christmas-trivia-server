const TRIVIA_QUESTIONS = [{
    type: "word", // What is your favorite Christmas movie?
    options: [
        "Elf",
        "White Christmas",
        "Rudolph The Red-nosed Reindeer",
        "The Polar Express",
        "A Charlie Brown Christmas",
        "The Santa Clause",
        "The Santa Clause 2",
        "Noelle",
        "Home Alone"
    ]
}, {
    type: "word", // What is your favorite Christmas beverage?
    options: [
        "Egg Nog",
        "Peppermint Mocha",
        "Apple Cider",
        "Hot Chocolate",
        "Peppermint Hot Chocolate",
        "Mulled Wine"
    ]
}, {
    type: "word", // What is your favorite Christmas song?
    options: [
        "Chesnuts Roasting On An Open Fire",
        "All I Want For Christmas Is You",
        "Last Christmas",
        "I'll Be Home For Christmas",
        "Let It Snow, Let It Snow, Let It Snow",
        "Frosty the Snowman",
        "First Snow"
    ],
}, {
    type: "word", // What is your favorite Christmas treat?
    options: [
        "Peanut Brittle",
        "Peppermint Bark",
        "Peanut Butter Fudge",
        "Almond Bark",
        "Fudge",
        "Gingerbread Cookies",
        "Cinnamon Rolls"
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
        "I Don't Decorate", 
        "I Never Take Them Down!"
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
        "Reindeer Feeder / Mucker", 
        "Present Maker / Wrapper", 
        "Sleigh Maintenance", 
        "Yikes, No Thanks"
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
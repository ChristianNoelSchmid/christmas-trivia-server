-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pictureUrl" TEXT,
    "toGiftId" INTEGER,
    "secretSantaGift" TEXT,
    CONSTRAINT "User_toGiftId_fkey" FOREIGN KEY ("toGiftId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Answer" (
    "userId" INTEGER NOT NULL,
    "qIndex" INTEGER NOT NULL,
    "choice" TEXT NOT NULL,

    PRIMARY KEY ("userId", "qIndex"),
    CONSTRAINT "Answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserToCreature" (
    "raterId" INTEGER NOT NULL,
    "ratedId" INTEGER NOT NULL,
    "creatureIndex" INTEGER NOT NULL,

    PRIMARY KEY ("raterId", "ratedId"),
    CONSTRAINT "UserToCreature_raterId_fkey" FOREIGN KEY ("raterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserToCreature_ratedId_fkey" FOREIGN KEY ("ratedId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_toGiftId_key" ON "User"("toGiftId");

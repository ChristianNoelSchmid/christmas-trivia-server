-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Answer" (
    "userId" INTEGER NOT NULL,
    "qIndex" INTEGER NOT NULL,
    "choice" TEXT NOT NULL,

    PRIMARY KEY ("userId", "qIndex"),
    CONSTRAINT "Answer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

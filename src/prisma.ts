import { PrismaClient } from "@prisma/client";
import { Response } from "express";

const db = new PrismaClient();

const query = async function<T>(res: Response, query: (db: PrismaClient) => Promise<T | undefined>) {
    try {
        return await query(db);
    } catch {
        res.status(500).send("Server error. Please try again later.");
        return undefined;
    }
}

export { query };
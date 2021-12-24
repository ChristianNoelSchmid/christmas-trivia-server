import { PrismaClient } from "@prisma/client";
import { Response } from "express";

const db = new PrismaClient();

const query = async function<T>(res: Response, query: (db: PrismaClient) => Promise<Response<T>>) {
    try {
        const value = await query(db);
        if(!value) {
            return res.status(500).send("Server error. Please try again later.");
        } else {
            return value;
        }
    } catch {
        return res.status(500).send("Server error. Please try again later.");
    }
}

export { db };
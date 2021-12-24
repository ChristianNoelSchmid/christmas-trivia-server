import { Request, Response } from "express";

import { db } from "./prisma";

/**
 * Handles basic authorization. Clients are expected to provide a
 * "user" object in the request body, with a name and password. That
 * data is then compared.
 */
const verifyToken = async (req: Request, res: Response, next: any) => {
  const userData = JSON.parse(req.headers.user as string);
  if (userData && userData.name && userData.password) {
    const user = await db.user.findFirst({ where: {
        name: userData.name
    }});

    if(user && user.password == userData.password) {
      req.userId = user.id;
      return next();
    }
  }

  return res.status(401).send("Please provide authorized user to interact with server.");
};

export { verifyToken };

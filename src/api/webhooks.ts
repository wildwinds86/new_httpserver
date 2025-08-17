import type { Request, Response } from "express";
import { upgradeChirpyRed } from "../db/queries/users.js"

export async function handlerWebhooks(req: Request, res: Response) {
    
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    };

    const params: parameters = req.body;
    
    if (params.event !== "user.upgraded") {
        console.log(`==>Problem with params: Event: ${params.event}`);
        res.status(204).send();
        return;
    }

    console.log(`==>Upgrading user: ${params.data.userId}`);

    let upgraded = await upgradeChirpyRed(params.data.userId);
    console.log(`==>Updated: ${upgraded.id}`)

    if (!upgraded) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(204);
}
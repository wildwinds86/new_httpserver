import type { Request, Response } from "express";
import { upgradeUser } from "../db/queries/users.js"

export async function handlerWebhooks(req: Request, res: Response) {
    
    type parameters = {
        event: string;
        data: data;
    };

    type data = {
        userId: string
    }

    const params: parameters = req.body;
    

    if (!params.event || params.event !== "user.upgraded") {
        console.log(`==>Problem with params: Event: ${params.event}`);
        res.sendStatus(204);
        return;
    }

    console.log(`==>Upgrading user: ${params.data.userId}`);

    let upgraded = await upgradeUser(params.data.userId);
    console.log(`==>Updated: ${upgraded[0].id}`)

    if (!upgraded) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(204);
}
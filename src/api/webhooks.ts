import type { Request, Response } from "express";
import { upgradeChirpyRed } from "../db/queries/users.js"
import { getAPIKey } from "../auth.js";
import { config } from "../config.js";

export async function handlerWebhooks(req: Request, res: Response) {
    
    type parameters = {
        event: string;
        data: {
            userId: string;
        };
    };

    const params: parameters = req.body;
    const apiKey: string = getAPIKey(req);
    
    if (params.event !== "user.upgraded") {
        console.log(`==>Problem with params: Event: ${params.event}`);
        res.status(204).send();
        return;
    }

    if (apiKey !== config.api.polkaKey) {
        console.log(`==>Invalid Polka API key received`);
        res.status(401).send();
    }

    console.log(`==>Upgrading user: ${params.data.userId}`);

    let upgraded = await upgradeChirpyRed(params.data.userId);
    console.log(`==>Updated: ${upgraded.id}`)

    if (!upgraded) {
        res.status(404).send();
        return;
    }

    res.sendStatus(204);
}
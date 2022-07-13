import express from "express";
import bodyParser from "body-parser";
import {PurchaseRepo} from "./PurchaseRepo";
import {Purchase} from "./Purchase";

export class PurchaseApi{
    constructor(private app: express.Application, private repo: PurchaseRepo) {
        app.use(bodyParser.json());
    }

    public start(port = 5000){
        this.app.post("/purchases", async (req: express.Request, res: express.Response) => {
            const response = await this.repo.save(req.body as Purchase);
            res.json(response);
        })

        this.app.get("/purchases", async (req: express.Request, res: express.Response) => {
            const response = await this.repo.find();
            res.json(response);
        })
        this.app.listen(port);
    }
}
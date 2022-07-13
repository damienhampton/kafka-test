import express from "express";
import bodyParser from "body-parser";
import {Purchase} from "./Purchase";
import {PurchaseService} from "./PurchaseService";

export class PurchaseApi{
    constructor(private app: express.Application, private service: PurchaseService) {
        app.use(bodyParser.json());
    }

    public start(port = 5000){
        this.app.post("/purchases", async (req: express.Request, res: express.Response) => {
            const response = await this.service.save(req.body as Purchase);
            res.json(response);
        })

        this.app.get("/purchases", async (req: express.Request, res: express.Response) => {
            const response = await this.service.find();
            res.json(response);
        })

        this.app.get("/purchases/:id", async (req: express.Request, res: express.Response) => {
            try {
                const response = await this.service.findById(req.params.id);
                res.json(response);
            }catch(e){
                console.log(e);
                res.status(500).json({ status: "That was a wrong un"});
            }
        })
        this.app.listen(port);
    }
}
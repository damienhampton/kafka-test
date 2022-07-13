import {PurchaseRepo} from "./PurchaseRepo";
import {Purchase} from "./Purchase";
import {PurchaseCompleteProducer} from "./PurchaseProducer";

export class PurchaseService{
    constructor(private repo: PurchaseRepo, private producer: PurchaseCompleteProducer) {}

    public async save(purchase: Purchase){
        const record = await this.repo.save(purchase);
        await this.producer.send(purchase.name);
        return record;
    }

    public async find(): Promise<Purchase[]>{
        return this.repo.find();
    }
}
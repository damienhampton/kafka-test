import {PurchaseRepo} from "./PurchaseRepo";
import {Purchase} from "./Purchase";
import {PurchaseProducer} from "./PurchaseProducer";

export class PurchaseService{
    constructor(private repo: PurchaseRepo, private producer: PurchaseProducer) {}

    public async save(purchase: Purchase){
        const record = await this.repo.save(purchase);
        await this.producer.send(record.id);
        return record;
    }

    public async find(): Promise<Purchase[]>{
        return this.repo.find();
    }
    public async findById(id: string){
        return this.repo.findById(id);
    }
}
import {PurchaseConsumer} from "./PurchaseConsumer";
import {PurchaseRepo} from "./PurchaseRepo";

export class PurchaseWorker {
    constructor(private consumer: PurchaseConsumer, private repo: PurchaseRepo) {}

    public async start(){
        await this.consumer.start(async ({ topic, partition, message }) => {
            const purchaseId = message.value?.toString();
            if(!purchaseId){
                return console.log("No purchase Id");
            }
            const record = await this.repo.findById(purchaseId);
            if(!record){
                return console.log("No record for", purchaseId);
            }
            record.complete = true;
            await this.repo.save(record);
        });
    }
}
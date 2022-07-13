import {PurchaseConsumer} from "./PurchaseConsumer";
import {PurchaseProducer} from "./PurchaseProducer";
import {PurchaseRepo} from "./PurchaseRepo";

export class PurchaseWorker {
    constructor(private consumer: PurchaseConsumer, private repo: PurchaseRepo) {}

    public async start(){
        await this.consumer.start(async ({ topic, partition, message }) => {
            const purchaseName = message.value?.toString();

            //await record = this.repo.findOne(id)
            //record.complete = true;
            //await this.repo.save(record);
        });
    }
}
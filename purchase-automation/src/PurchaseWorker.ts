import {PurchaseConsumer} from "./PurchaseConsumer";
import {PurchaseProducer} from "./PurchaseProducer";

export class PurchaseWorker {
    constructor(private consumer: PurchaseConsumer, private producer: PurchaseProducer) {}

    public async start(){
        await this.producer.start();
        await this.consumer.start(async ({ topic, partition, message }) => {
            const purchaseName = message.value?.toString();
            console.log("PurchaseConsumer", topic, partition, purchaseName);
            return this.producer.send(`Purchase complete: ${purchaseName}`)
        });
    }
}
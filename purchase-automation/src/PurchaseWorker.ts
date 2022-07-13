import {PurchaseConsumer} from "./PurchaseConsumer";
import {PurchaseProducer} from "./PurchaseProducer";

export class PurchaseWorker {
    constructor(private consumer: PurchaseConsumer, private producer: PurchaseProducer) {}

    public async start(){
        await this.producer.start();
        await this.consumer.start(async ({ topic, partition, message }) => {
            const purchaseId = message.value?.toString();
            if(!purchaseId){
                return console.log("No purchase Id");
            }
            console.log("PurchaseConsumer - processing purchase", topic, partition, purchaseId);
            await sleep(5000);
            console.log("PurchaseConsumer - purchase complete", topic, partition, purchaseId);
            await this.producer.send(purchaseId)
        });
    }
}

function sleep(t = 1000){
    return new Promise(resolve => setTimeout(resolve, t));
}
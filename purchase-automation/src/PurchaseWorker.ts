import {PurchaseConsumer} from "./PurchaseConsumer";
import {PurchaseProducer} from "./PurchaseProducer";
import {Purchase} from "./Purchase";

export class PurchaseWorker {
    constructor(private consumer: PurchaseConsumer, private producer: PurchaseProducer) {}

    public async start(){
        await this.producer.start();
        await this.consumer.start(async (purchase: Purchase) => {
            console.log("Consumer message", purchase);
            const { id, name } = purchase;
            console.log("Automation PurchaseConsumer - processing purchase", purchase);
            await sleep(5000);
            console.log("Automation PurchaseConsumer - purchase complete", purchase);
            await this.producer.send({  id, name, complete: true });
            console.log("Automation PurchaseProducer - puchase-complete purchase id", purchase);
        });
    }
}

function sleep(t = 1000){
    return new Promise(resolve => setTimeout(resolve, t));
}
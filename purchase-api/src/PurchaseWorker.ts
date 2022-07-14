import {PurchaseConsumer} from "./PurchaseConsumer";
import {PurchaseRepo} from "./PurchaseRepo";
import {Purchase} from "./Purchase";

export class PurchaseWorker {
    constructor(private consumer: PurchaseConsumer, private repo: PurchaseRepo) {}

    public async start(){
        await this.consumer.start(async (purchase: Purchase) => {
            try {
                if(!purchase.id){
                    return console.log("No purchase id", purchase);
                }
                const record = await this.repo.findById(purchase.id);
                if (!record) {
                    return console.log("No record for", purchase);
                }
                record.complete = true;
                await this.repo.save(record);
                console.log("API DB - updating purchase", purchase.id);
            }catch(_e){
                const e = _e as Error;
                console.log(e.message);
            }
        });
    }
}
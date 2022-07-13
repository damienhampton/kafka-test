import { Schema, model } from "mongoose";
import {Purchase} from "./Purchase";

const purchaseSchema = new Schema<Purchase>({ name: String, complete: Boolean });
const PurchaseRecord = model<Purchase>('Purchase',purchaseSchema);

export class PurchaseRepo{
    public async save(purchase: Purchase){
        return (new PurchaseRecord(purchase)).save();
    }

    public async find(){
        return PurchaseRecord.find();
    }
    public async findById(id: string){
        return PurchaseRecord.findById(id);
    }
}
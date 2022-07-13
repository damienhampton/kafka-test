import {Kafka} from "kafkajs";

export class PurchaseProducer {
    private producer;

    constructor(kafka: Kafka, private topic: string) {
        this.producer = kafka.producer();
    }
    public async start(){
        return this.producer.connect();
    }
    public async send(message: string){
        return this.producer.send({
            topic: this.topic,
            messages: [
                { value: message },
            ],
        })
    }
}
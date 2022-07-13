import {Kafka, KafkaMessage} from "kafkajs";

export class PurchaseConsumer {
    private consumer;

    constructor(kafka: Kafka, private topic: string) {
        this.consumer = kafka.consumer({ groupId: 'test-group' })
    }

    public async start(func: (args: { topic: string, partition: number, message: KafkaMessage }) => Promise<void>){
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: this.topic, fromBeginning: true })

        await this.consumer.run({
            eachMessage: func,
        })
    }
}
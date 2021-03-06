import {Kafka, KafkaMessage} from "kafkajs";
import {SchemaRegistry} from "@kafkajs/confluent-schema-registry";

export class PurchaseConsumer {
    private consumer;

    constructor(kafka: Kafka, private registry: SchemaRegistry, private topic: string, groupId: string) {
        this.consumer = kafka.consumer({ groupId })
    }

    public async start<T>(func: (message: T) => Promise<void>){
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: this.topic, fromBeginning: true })

        await this.consumer.run({
            eachMessage: async (args: { topic: string, partition: number, message: KafkaMessage}) => {
                if(!args.message.key || !args.message.value) {
                    return console.log("Message has no key or value!");
                }
                const decodedValue = (await this.registry.decode(args.message.value)) as T;
                console.log("decodedValue", decodedValue);
                return func(decodedValue);
            },
        })
    }
}
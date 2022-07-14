import {Kafka, Partitioners} from "kafkajs";
import {SchemaRegistry} from "@kafkajs/confluent-schema-registry";

export class PurchaseProducer {
    private producer;

    constructor(kafka: Kafka, private registry: SchemaRegistry, private topic: string) {
        this.producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    }
    public async start(){
        return this.producer.connect();
    }
    public async send(message: string){
        const id = await this.registry.getRegistryId(subject, version)

        const value = await this.registry.encode(id, { message })
        return this.producer.send({
            topic: this.topic,
            messages: [
                { value },
            ],
        })
    }
}
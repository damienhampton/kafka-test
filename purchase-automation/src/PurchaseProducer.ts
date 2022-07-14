import {Kafka, Partitioners} from "kafkajs";
import {SchemaRegistry} from "@kafkajs/confluent-schema-registry";

export class PurchaseProducer {
    private producer;
    // private schemaSubject = "json.Purchase";
    private schemaSubject = "proto.Purchase";

    constructor(kafka: Kafka, private registry: SchemaRegistry, private topic: string) {
        this.producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });
    }
    public async start(){
        return this.producer.connect();
    }
    public async send<T>(payload: T){
        const id = await this.registry.getRegistryId(this.schemaSubject, 1);

        const message = {
            key: this.schemaSubject,
            value: await this.registry.encode(id,payload)
        }
        return this.producer.send({
            topic: this.topic,
            messages: [
                message,
            ],
        })
    }
}
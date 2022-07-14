import dotenv from 'dotenv';
dotenv.config();

import { Kafka } from "kafkajs";
import {PurchaseConsumer} from "./PurchaseConsumer";
import {PurchaseWorker} from "./PurchaseWorker";
import {PurchaseProducer} from "./PurchaseProducer";
import {SchemaRegistry} from "@kafkajs/confluent-schema-registry";

const KAFKA_HOST = process.env.KAFKA_HOST || "localhost";
const SCHEMA_REGISTRY_HOST = process.env.SCHEMA_REGISTRY_HOST || "localhost";

async function main() {
    const kafkaBrokers = [`${KAFKA_HOST}:9092`];
    const schemaRegistryHost = `http://${SCHEMA_REGISTRY_HOST}:8081`;
    console.log("Automation", kafkaBrokers);

    const registry = new SchemaRegistry({ host: schemaRegistryHost });

    const kafka = new Kafka({
        clientId: 'purchase-worker',
        brokers: kafkaBrokers,
    })

    const purchaseProducer = new PurchaseProducer(kafka, registry, "purchase-complete");
    const purchaseConsumer = new PurchaseConsumer(kafka, registry, "purchase-created", "automation-group");

    const purchaseWorker = new PurchaseWorker(purchaseConsumer, purchaseProducer)
    await purchaseWorker.start();
}

main();
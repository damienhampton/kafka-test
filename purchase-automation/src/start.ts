import dotenv from 'dotenv';
dotenv.config();

import { Kafka } from "kafkajs";
import {PurchaseConsumer} from "./PurchaseConsumer";
import {PurchaseWorker} from "./PurchaseWorker";
import {PurchaseProducer} from "./PurchaseProducer";

const KAFKA_HOST = process.env.KAFKA_HOST || "localhost";

async function main() {
    const kafkaBrokers = [`${KAFKA_HOST}:9092`];
    console.log("Automation", kafkaBrokers);

    const kafka = new Kafka({
        clientId: 'purchase-worker',
        brokers: kafkaBrokers,
    })

    const purchaseProducer = new PurchaseProducer(kafka, "purchase-complete");
    const purchaseConsumer = new PurchaseConsumer(kafka, "purchase-created", "automation-group");

    const purchaseWorker = new PurchaseWorker(purchaseConsumer, purchaseProducer)
    await purchaseWorker.start();
}

main();
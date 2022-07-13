import { Kafka } from "kafkajs";
import {PurchaseConsumer} from "./PurchaseConsumer";
import {PurchaseWorker} from "./PurchaseWorker";
import {PurchaseProducer} from "./PurchaseProducer";

const KAFKA_HOST = process.env.KAFKA_HOST || "localhost";

async function main() {
    const kafka = new Kafka({
        clientId: 'purchase-worker',
        brokers: [`${KAFKA_HOST}:9092`],
    })

    const purchaseProducer = new PurchaseProducer(kafka, "purchase-complete");
    const purchaseConsumer = new PurchaseConsumer(kafka, "purchase-created");

    const purchaseWorker = new PurchaseWorker(purchaseConsumer, purchaseProducer)
    await purchaseWorker.start();
}

main();
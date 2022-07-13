import express from 'express';

import mongoose from 'mongoose';
import { PurchaseRepo } from "./PurchaseRepo";
import { PurchaseApi } from "./PurchaseApi";

import { Kafka } from "kafkajs";
import {PurchaseService} from "./PurchaseService";
import {PurchaseProducer} from "./PurchaseProducer";

const KAFKA_HOST = process.env.KAFKA_HOST || "localhost";
const MONGO_HOST = process.env.MONGO_HOST || "localhost";
const PORT = (process.env.PORT || 5000) as number;

async function main() {
    const kafka = new Kafka({
        clientId: 'purchase-api',
        brokers: [`${KAFKA_HOST}:9092`],
    })

    await mongoose.connect(`mongodb://${MONGO_HOST}:27017/purchases`);

    const app = express();

    const purchaseRepo = new PurchaseRepo();
    const purchaseProducer = new PurchaseProducer(kafka);
    await purchaseProducer.start();
    const purchaseService = new PurchaseService(purchaseRepo, purchaseProducer)
    const purchaseApi = new PurchaseApi(app, purchaseService);

    purchaseApi.start(PORT);
}

main();
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import mongoose from 'mongoose';
import { PurchaseRepo } from "./PurchaseRepo";
import { PurchaseApi } from "./PurchaseApi";

import { Kafka } from "kafkajs";
import {PurchaseService} from "./PurchaseService";
import {PurchaseProducer} from "./PurchaseProducer";
import {PurchaseWorker} from "./PurchaseWorker";
import {PurchaseConsumer} from "./PurchaseConsumer";
import { SchemaRegistry } from '@kafkajs/confluent-schema-registry';

const KAFKA_HOST = process.env.KAFKA_HOST || "localhost";
const SCHEMA_REGISTRY_HOST = process.env.SCHEMA_REGISTRY_HOST || "localhost";
const MONGO_HOST = process.env.MONGO_HOST || "localhost";
const PORT = (process.env.PORT || 5000) as number;

async function main() {
    const kafkaBrokers = [`${KAFKA_HOST}:9092`];
    const schemaRegistryHost = `http://${SCHEMA_REGISTRY_HOST}:8081`;
    const mongoUri = `mongodb://${MONGO_HOST}:27017/purchases`;
    console.log("API", kafkaBrokers, schemaRegistryHost, mongoUri);

    const registry = new SchemaRegistry({ host: schemaRegistryHost });

    const kafka = new Kafka({
        clientId: 'purchase-api',
        brokers: kafkaBrokers,
    })

    await mongoose.connect(mongoUri);

    const app = express();

    const purchaseRepo = new PurchaseRepo();
    const purchaseProducer = new PurchaseProducer(kafka, registry, "purchase-created");
    await purchaseProducer.start();
    const purchaseConsumer = new PurchaseConsumer(kafka, registry, "purchase-complete", "api-group");

    const purchaseService = new PurchaseService(purchaseRepo, purchaseProducer)
    const purchaseApi = new PurchaseApi(app, purchaseService);
    const purchaseWorker = new PurchaseWorker(purchaseConsumer, purchaseRepo);
    await purchaseWorker.start();

    purchaseApi.start(PORT);
}

main();
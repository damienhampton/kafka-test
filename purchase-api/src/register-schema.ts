import dotenv from 'dotenv';
dotenv.config();
import {SchemaRegistry, SchemaType} from '@kafkajs/confluent-schema-registry';
import fs from "fs";

const SCHEMA_REGISTRY_HOST = process.env.SCHEMA_REGISTRY_HOST || "localhost:8081";

async function main() {
    const schemaRegistryHost = `http://${SCHEMA_REGISTRY_HOST}`;

    const registry = new SchemaRegistry({host: schemaRegistryHost});

    const schema = fs.readFileSync("./schemas/purchase.json", { encoding: "utf8" });

    const {id} = await registry.register({type: SchemaType.JSON, schema}, { subject: 'json.Purchase'})
    console.log("Success", id);
}

main();
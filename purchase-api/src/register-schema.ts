import dotenv from 'dotenv';
dotenv.config();
import {SchemaRegistry, SchemaType} from '@kafkajs/confluent-schema-registry';
import fs from "fs";

const SCHEMA_REGISTRY_HOST = process.env.SCHEMA_REGISTRY_HOST || "localhost:8081";

async function main() {
    const schemaRegistryHost = `http://${SCHEMA_REGISTRY_HOST}`;

    const registry = new SchemaRegistry({host: schemaRegistryHost});

    async function registerSchema(path: string, type: SchemaType.JSON | SchemaType.PROTOBUF, subject: string){
        const schema = fs.readFileSync(path, { encoding: "utf8" });

        const {id} = await registry.register({type, schema}, { subject })
        console.log("Success", id);
    }

    await registerSchema("./schemas/purchase.json", SchemaType.JSON, "json.Purchase");
    await registerSchema("./schemas/purchase.proto", SchemaType.PROTOBUF, "proto.Purchase");
}



main();
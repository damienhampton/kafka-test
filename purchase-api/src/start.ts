import express from 'express';

import mongoose from 'mongoose';
import { PurchaseRepo } from "./PurchaseRepo";
import { PurchaseApi } from "./PurchaseApi";

mongoose.connect('mongodb://localhost:27017/purchases');

const port = (process.env.PORT || 5000) as number;
const app = express();
const purchaseRepo = new PurchaseRepo();
const purchaseApi = new PurchaseApi(app, purchaseRepo);

purchaseApi.start(port);
var mongoose = require('mongoose')
    , Schema = mongoose.Schema

import { composeWithMongoose } from 'graphql-compose-mongoose';

import { Vendor, VendorTC } from './VendorModel';

require('../db');

var ProductSchema = new Schema({
    name: String,
    description: String,
    vendor: { type: Schema.Types.ObjectId, ref: Vendor },
    price: Number,
    type: { type: String, enum: ['Entree', 'Drink', 'Addon'] },
    category: String
});

export const Product = mongoose.model("Products", ProductSchema);
export const ProductTC = composeWithMongoose(Product);

// Add relations: https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
ProductTC.addRelation("vendor", {
    "resolver": () => VendorTC.getResolver('findById'),
    prepareArgs: {
        _id: (source) => source.vendor,
    },
    projection: { vendor: 1 }
});
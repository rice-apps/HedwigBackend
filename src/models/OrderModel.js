var mongoose = require('mongoose')
    , Schema = mongoose.Schema

import { composeWithMongoose } from 'graphql-compose-mongoose';

import { User, UserTC } from './UserModel';
import { Vendor, VendorTC } from './VendorModel';
import { Product, ProductTC } from './ProductModel';

require('../db');

var OrderItemSchema = new Schema({
    product: { type: Schema.Types.ObjectId, ref: Product },
    addons: [{ type: Schema.Types.ObjectId, ref: Product }],
    comments: String // special requests, etc
});

var OrderSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: User },
    vendor: { type: Schema.Types.ObjectId, ref: Vendor },
    items: [OrderItemSchema],
    discount: { type: Number, min: 1, max: 100 }, // Percentage
    fulfillment: { type: String, enum: ['Placed', 'Preparing', 'Ready', 'Cancelled'], default: "Placed" }
}, { timestamps: true });

export const Order = mongoose.model("Orders", OrderSchema);
export const OrderTC = composeWithMongoose(Order);

// Add relations: https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
OrderTC.addRelation("user", {
    "resolver": () => UserTC.getResolver('findById'),
    prepareArgs: {
        _id: (source) => source.user,
    },
    projection: { user: 1 }
});

OrderTC.addRelation("vendor", {
    "resolver": () => VendorTC.getResolver('findById'),
    prepareArgs: {
        _id: (source) => source.vendor,
    },
    projection: { vendor: 1 }
});

/**
 * Add relation for a nested field: https://github.com/graphql-compose/graphql-compose/issues/2
 * But the .getByPath(path) method doesn't exist anymore, so to get the TypeComposer of the nested field (in this case, "items")
 * We need to use .getFieldTC(path)
 */
const ItemsTC = OrderTC.getFieldTC("items");
ItemsTC.addRelation("product", {
    "resolver": () => ProductTC.getResolver("findById"),
    prepareArgs: {
        _id: (source) => source.product
    },
    projection: { product: 1 }
});

ItemsTC.addRelation("addons", {
    "resolver": () => ProductTC.getResolver("findByIds"),
    prepareArgs: {
        _ids: (source) => source.addons
    },
    projection: { addons: 1 }
});

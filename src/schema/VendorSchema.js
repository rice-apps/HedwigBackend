import { Vendor, VendorTC, OrderTC, Order, ProductTC, Product, UserTC, LocationTC } from '../models';
import { pubsub } from '../pubsub';
import { withFilter } from 'apollo-server-express';

/**
 * Custom GraphQL-only fields (essentially additional fields on top of our existing Mongoose-defined Schema)
 */

VendorTC.addFields({
    products: [ProductTC],
    activeOrders: [OrderTC],
    completedOrders: [OrderTC],
    cancelledOrders: [OrderTC]
});

/**
 * Relations (necessary for any fields that link to other types in the schema)
 * https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
 */

// Creates relation to user schema
VendorTC.addRelation("team", {
    "resolver": () => UserTC.getResolver('findByIds'),
    prepareArgs: {
        _ids: (source) => source.team,
    },
    projection: { team: 1 }
});

// Creates relation to locations schema
VendorTC.addRelation("locations", {
    "resolver": () => LocationTC.getResolver("findByIds"),
    prepareArgs: {
        _ids: (source) => source.locations,
    },
    projection: { locations: 1 }
});

// Creates relation to product schema
VendorTC.addRelation("products", {
    "resolver": () => ProductTC.getResolver("findManyByVendor"),
    prepareArgs: {
        _id: (source) => source._id, // Uses the vendor _id
    },
    projection: { products: 1 }
});

// Creates relation to order schema; grabs all ACTIVE orders
VendorTC.addRelation("activeOrders", {
    "resolver": () => OrderTC.getResolver("findManyByVendor"),
    prepareArgs: {
        _id: (source) => source._id,
        fulfillmentStates: (source) => ["Placed", "Preparing"]
    },
    projection: { activeOrders: 1 }
});

// Creates relation to order schema; grabs all COMPLETED orders
VendorTC.addRelation("completedOrders", {
    "resolver": () => OrderTC.getResolver("findManyByVendor"),
    prepareArgs: {
        _id: (source) => source._id,
        fulfillmentStates: (source) => ["Ready"]
    },
    projection: { completedOrders: 1 }
});

// Creates relation to order schema; grabs all CANCELLED orders
VendorTC.addRelation("cancelledOrders", {
    "resolver": () => OrderTC.getResolver("findManyByVendor"),
    prepareArgs: {
        _id: (source) => source._id,
        fulfillmentStates: (source) => ["Cancelled"]
    },
    projection: { cancelledOrders: 1 }
});

/**
 * Custom Resolvers
 */

 /**
  * Used to update a vendor's hours
  * Can either add or remove an interval from their operating hours
  */
VendorTC.addResolver({
    name: "vendorUpdateHourSet",
    type: VendorTC,
    // day is an enum, so we want to get its enum from the model directly
    args: { id: "ID!", push: "Boolean", start: "Int!", end: "Int!", day: VendorTC.getFieldTC("hours").getFieldType("day") },
    resolve: async ({ source, args, context, info }) => {
        // This determines whether we add or remove from the array
        let operation = args.push ? "$addToSet" : "$pull";
        // Setup update based on operation
        let update = {}
        update[operation] = { hours: { start: args.start, end: args.end, day: args.day } };
        // Execute update
        const vendor = await Vendor.updateOne(
            { _id: args.id }, // find Vendor by id
            update
        );
        if (!vendor) return null; 
        return Vendor.findById(args.id); // Finally return the vendor object
    }
});

const VendorQuery = {
    vendorOne: VendorTC.getResolver('findOne'),
    vendorMany: VendorTC.getResolver('findMany'),
};

const VendorMutation = {
    vendorCreateOne: VendorTC.getResolver('createOne'),
    vendorAddHourSet: VendorTC.getResolver("vendorUpdateHourSet").wrapResolve(next => rp => {
        rp.args.push = true;
        return next(rp);
    }),
    vendorRemoveHourSet: VendorTC.getResolver("vendorUpdateHourSet").wrapResolve(next => rp => {
        rp.args.push = false;
        return next(rp);
    }),
    vendorUpdateOne: VendorTC.getResolver('updateOne')
};

// Need a custom subscription resolver: https://github.com/graphql-compose/graphql-compose-subscription-boilerplate/blob/master/src/schema/index.js
const VendorSubscription = {
    orderAdded: {
        // "type" field has to be a TypeComposer, not just a string.
        type: OrderTC,
        args: { vendorID: "ID!" },
        /**
         * This is important: graphql-compose returns "record" and "recordId" as the top level parts of a payload; like so:
         * payload: {
         *  record: {},
         *  recordId: ""
         * }
         * Thus, the object we need (the new order) is INSIDE the .record portion
        */
        resolve: payload => payload.record ? payload.record : payload,
        // withFilter wrapper https://www.apollographql.com/docs/graphql-subscriptions/setup/#filter-subscriptions
        subscribe: withFilter(() => pubsub.asyncIterator("orderAdded"), (payload, variables) => {
            return payload.record.vendor == variables.vendorID
        })
    }
}

export { VendorQuery, VendorMutation, VendorSubscription };
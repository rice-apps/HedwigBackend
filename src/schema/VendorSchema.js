import { Vendor, VendorTC, OrderTC } from '../models';
import { pubsub } from '../pubsub';
import { withFilter } from 'apollo-server-express';

// Define custom resolvers here
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
    vendorMany: VendorTC.getResolver('findMany')
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
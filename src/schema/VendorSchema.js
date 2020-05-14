import { Vendor, VendorTC, OrderTC } from '../models';
import { pubsub } from '../pubsub';
import { withFilter } from 'apollo-server-express';

const VendorQuery = {
    vendorOne: VendorTC.getResolver('findOne')
};

const VendorMutation = {
    vendorCreateOne: VendorTC.getResolver('createOne')
};

// Need a custom subscription resolver: https://github.com/graphql-compose/graphql-compose-subscription-boilerplate/blob/master/src/schema/index.js
const VendorSubscription = {
    updateOrders: {
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
        resolve: payload => payload.record,
        // withFilter wrapper https://www.apollographql.com/docs/apollo-server/data/subscriptions/
        subscribe: withFilter(() => pubsub.asyncIterator("updateOrders"), (payload, variables) => {
            return payload.record.vendor == variables.vendorID
        })
    }
}

export { VendorQuery, VendorMutation, VendorSubscription };
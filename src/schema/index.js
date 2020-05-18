import { SchemaComposer } from 'graphql-compose';

require('../db'); 

const schemaComposer = new SchemaComposer();

import { UserQuery, UserMutation } from './UserSchema';
import { LocationQuery, LocationMutation } from './LocationSchema';
import { ProductQuery, ProductMutation } from './ProductSchema';
import { OrderQuery, OrderMutation } from './OrderSchema';
import { VendorQuery, VendorMutation, VendorSubscription } from './VendorSchema';

schemaComposer.Query.addFields({
    ...UserQuery,
    ...LocationQuery,
    ...ProductQuery,
    ...OrderQuery,
    ...VendorQuery,
});

schemaComposer.Mutation.addFields({
    ...UserMutation,
    ...LocationMutation,
    ...ProductMutation,
    ...OrderMutation,
    ...VendorMutation,
});

schemaComposer.Subscription.addFields({
    ...VendorSubscription
})

export default schemaComposer.buildSchema();
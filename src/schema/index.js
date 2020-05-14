import { SchemaComposer } from 'graphql-compose';

require('../db'); 

const schemaComposer = new SchemaComposer();

import { UserQuery, UserMutation } from './UserSchema';
import { LocationQuery, LocationMutation } from './LocationSchema';
import { VendorQuery, VendorMutation } from './VendorSchema';
import { ProductQuery, ProductMutation } from './ProductSchema';
import { OrderQuery, OrderMutation } from './OrderSchema';

schemaComposer.Query.addFields({
    ...UserQuery,
    ...LocationQuery,
    ...VendorQuery,
    ...ProductQuery,
    ...OrderQuery
});

schemaComposer.Mutation.addFields({
    ...UserMutation,
    ...LocationMutation,
    ...VendorMutation,
    ...ProductMutation,
    ...OrderMutation
});

export default schemaComposer.buildSchema();
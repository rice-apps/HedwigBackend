import { Product, ProductTC } from '../models';

/**
 * Custom Resolvers
 */

/**
 * Used to find all products for a particular vendor
 */
ProductTC.addResolver({
    name: "findManyByVendor",
    type: [ProductTC],
    args: { _id: "ID!" },
    resolve: async ({ source, args, context, info }) => {
        return await Product.find({ vendor: args._id });
    }
})

const ProductQuery = {
    productOne: ProductTC.getResolver('findOne'),
    productMany: ProductTC.getResolver("findMany"),
};

const ProductMutation = {
    productCreateOne: ProductTC.getResolver('createOne')
};

export { ProductQuery, ProductMutation };
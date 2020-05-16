import { Product, ProductTC } from '../models';

const ProductQuery = {
    productOne: ProductTC.getResolver('findOne'),
    productMany: ProductTC.getResolver("findMany")
};

const ProductMutation = {
    productCreateOne: ProductTC.getResolver('createOne')
};

export { ProductQuery, ProductMutation };
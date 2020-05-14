import { Product, ProductTC } from '../models';

const ProductQuery = {
    productOne: ProductTC.getResolver('findOne')
};

const ProductMutation = {
    productCreateOne: ProductTC.getResolver('createOne')
};

export { ProductQuery, ProductMutation };
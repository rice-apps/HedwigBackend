import { Order, OrderTC } from '../models';

const OrderQuery = {
    orderOne: OrderTC.getResolver('findOne')
};

const OrderMutation = {
    orderCreateOne: OrderTC.getResolver('createOne')
};

export { OrderQuery, OrderMutation };
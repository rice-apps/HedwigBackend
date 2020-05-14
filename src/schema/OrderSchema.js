import { Order, OrderTC } from '../models';
import { pubsub } from '../pubsub';

const OrderQuery = {
    orderOne: OrderTC.getResolver('findOne')
};

const OrderMutation = {
    // https://graphql-compose.github.io/docs/basics/what-is-resolver.html#via-resolverwrapresolve
    orderCreateOne: OrderTC.getResolver("createOne").wrapResolve(next => rp => {
        // Inspiration from: https://github.com/graphql-compose/graphql-compose/issues/60#issuecomment-354152014
        // First, execute the creation
        const createOne = next(rp);
        // We want to execute our pubsub AFTER the "createOne" resolver executes
        return createOne.then(payload => {
            pubsub.publish("updateOrders", payload);
            // This makes sure we still return the created object to the original mutation call
            return payload;
        });
    })
};

export { OrderQuery, OrderMutation };
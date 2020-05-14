import { User, UserTC } from '../models';

const UserQuery = {
    userOne: UserTC.getResolver('findOne')
};

const UserMutation = {
    userCreateOne: UserTC.getResolver('createOne')
};

export { UserQuery, UserMutation };
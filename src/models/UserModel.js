var mongoose = require('mongoose')
    , Schema = mongoose.Schema

import { composeWithMongoose } from 'graphql-compose-mongoose';

require('../db');

var UserSchema = new Schema({
    name: String,
    netid: { type: String, unique: true },
    phone: String,
    type: { type: String, enum: ['Undergraduate', 'Graduate', 'Faculty', 'Staff']},
    isAdmin: Boolean
});

export const User = mongoose.model("Users", UserSchema);
export const UserTC = composeWithMongoose(User);

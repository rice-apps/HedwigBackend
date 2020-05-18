var mongoose = require('mongoose')
    , Schema = mongoose.Schema

import { composeWithMongoose } from 'graphql-compose-mongoose';

import { User, UserTC } from './UserModel';
import { Location, LocationTC } from './LocationModel';

require('../db');

var OpenIntervalSchema = new Schema({
    day: { type: String, enum: ["M", "T", "W", "R", "F", "S", "U"] },
    start: Number,
    end: Number
})

var VendorSchema = new Schema({
    name: String,
    phone: String,
    type: { type: String, enum: ['SRB', 'Retail', 'Servery']},
    team: [{ type: Schema.Types.ObjectId, ref: User }],
    hours: [OpenIntervalSchema],
    locations: [{ type: Schema.Types.ObjectId, ref: Location }]
});

export const Vendor = mongoose.model("Vendors", VendorSchema);
export const VendorTC = composeWithMongoose(Vendor);
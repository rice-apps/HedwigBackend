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

// Add relations: https://graphql-compose.github.io/docs/plugins/plugin-mongoose.html#how-to-build-nesting-relations
VendorTC.addRelation("team", {
    "resolver": () => UserTC.getResolver('findByIds'),
    prepareArgs: {
        _ids: (source) => source.team,
    },
    projection: { team: 1 }
});

VendorTC.addRelation("locations", {
    "resolver": () => LocationTC.getResolver("findByIds"),
    prepareArgs: {
        _ids: (source) => source.locations,
    },
    projection: { locations: 1 }
});
import { PubSub } from "apollo-server-express";

// Initialize PubSub: https://www.apollographql.com/docs/apollo-server/data/subscriptions/
export const pubsub = new PubSub();
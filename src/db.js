let mongoose = require("mongoose");
let { MONGODB_CONNECTION_STRING } = require("./config");

const url = MONGODB_CONNECTION_STRING;

// Avoid deprecation warnings: https://mongoosejs.com/docs/deprecations.html
const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}

mongoose.connect(url, options);

mongoose.connection.on("connected", function() {
  console.log("Mongoose connected to " + url);
});
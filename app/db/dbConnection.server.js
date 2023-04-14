import mongoose from "mongoose";
import { models } from "./models.js";

const { MONGODB_URL, NODE_ENV } = process.env;

if (!MONGODB_URL) {
  if (NODE_ENV === "production") {
    throw new Error(
      "Please define the MONGODB_URL environment variable."
    );
  } else {
    throw new Error(
      "Please define the MONGODB_URL environment variable inside an .env file."
    );
  }
}

export default function connectDb() {
  if (mongoose.connection.readyState > 0) {
    if (NODE_ENV === "development") {
      for (const model of models) {
        if (mongoose.connection.models[model.name]) {
          mongoose.connection.deleteModel(model.name);
        }
        mongoose.connection.model(model.name, model.schema, model.collection);
      }
    }

    return mongoose.connection;
  }

  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected, NODE_ENV=%s", NODE_ENV);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose DISCONNECTED, NODE_ENV=%s", NODE_ENV);
  });

  mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  for (const model of models) {
    mongoose.connection.model(model.name, model.schema, model.collection);
  }

  return mongoose.connection;
}

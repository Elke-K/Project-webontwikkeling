import { MONGODB_URI } from "./database";
import session, { MemoryStore } from "express-session";
import { FlashMessage, User } from "./types";
import MongoStore from "connect-mongo";

if(!process.env.SESSION_SECRET){
  console.error("SESSION SECRET not provided in .env!");
  process.exit(1);
}

const mongoStore = MongoStore.create({
  mongoUrl: MONGODB_URI,
  dbName: "sessions",
  collectionName: "login-express",
});

mongoStore.on("error", (error) => {
  console.error(error);
});

declare module "express-session" {
  export interface SessionData {
    user?: User;
    message?: FlashMessage;
  }
}

export default session({
  secret: process.env.SESSION_SECRET,
  store: mongoStore,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});

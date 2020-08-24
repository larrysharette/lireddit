import { PRODUCTION, COOKIE_NAME } from "./constants";
import "reflect-metadata";
import resolvers from "./resolvers";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import session from "express-session";
import pg from "pg";
import connectPg from "connect-pg-simple";
import cors from "cors";
import { createConnection } from "typeorm";
import entities from "./entities";

const pgSession = connectPg(session);
const main = async () => {
  // const conn =
  await createConnection({
    type: "postgres",
    database: "lireddit2",
    username: "postgres",
    password: "password",
    logging: !PRODUCTION,
    synchronize: !PRODUCTION,
    entities,
  });

  const app = express();

  const pgPool = new pg.Pool({
    user: "postgres",
    password: "password",
    database: "lireddit",
  });

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new pgSession({ pool: pgPool, tableName: "session" }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: PRODUCTION, // cookie only works in https
      },
      secret: "B@B@w00bi35!",
      saveUninitialized: false,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers,
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(4000, () => {
    console.log("Now Listening on port: 4000");
  });
};

main().catch((err) => console.error(err));

import express from "express";
import path from "path";
import cors from "cors";
import { GraphQLClient } from "graphql-request";
import { Headers } from "cross-fetch";
import axios from "axios";
import * as url from "url";
import config from "./config.mjs";
import GET_ORDERS from "./gql/GET_ORDERS.mjs";

// Init app
const app = express();

// Config
const {
  shopify_access_token,
  shopify_endpoint,
  x_password,
  x_username,
  server_port,
} = config;

// Headers config
global.Headers = global.Headers || Headers;

// Ressurect __dirname
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const encodeAuthHeader = () => {
  const base64Encode = Buffer.from(`${x_username}:${x_password}`).toString(
    "base64"
  );
  return `Basic ${base64Encode}`;
};

app.get("/api/test", (req, res) => {
  res.json({ status: "API WORKING" });
});

app.post("/api/toexp", async (req, res) => {
  const result = await axios.put(
    "https://online.x-express.ba/api/rezervacija",
    req.body,
    {
      headers: {
        Authorization: encodeAuthHeader(),
        "Content-Type": "text/plain",
      },
    }
  );
  res.json(result.data);
});

app.get("/api/orders", (req, res) => {
  const client = new GraphQLClient(shopify_endpoint, {
    headers: {
      "X-Shopify-Access-Token": shopify_access_token,
    },
  });
  client.request(GET_ORDERS).then((data) => {
    res.json(data);
  });
});

// When client reqests any other page bring it back to index
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.set("port", server_port);
app.listen(server_port, () =>
  console.log(`API running on localhost:${server_port}`)
);

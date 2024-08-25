import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { default as v1 } from "./routes/v1/router.js";
import Vault from "./src/vault.js";

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: false }));

// fetch pinecone key from hashicorp vault
const vault = new Vault(
  process.env.HCP_CLIENT_ID ?? "",
  process.env.HCP_CLIENT_SECRET ?? "",
  process.env.HCP_VAULT_URL ?? ""
);

// fetch our database key
const pineconeSk = (await vault.fetchSecret("pinecone"))?.value;

app.use("/v1", v1);

app.listen(42000, () => {
  console.log("App listening on port 42000");
});

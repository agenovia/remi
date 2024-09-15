import cookieParser from "cookie-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import Vault from "./lib/vault.js";
import { initRoute, default as v1 } from "./routes/v1/router.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// access hcp vault
const vault = new Vault(
  process.env.HCP_CLIENT_ID ?? "",
  process.env.HCP_CLIENT_SECRET ?? "",
  process.env.HCP_VAULT_URL ?? ""
);

// fetch our secrets
const [pineconeSK, supabaseURL, supabaseSK, openAIApiKey] = [
  (await vault.fetchSecret("pinecone"))?.value ?? "",
  (await vault.fetchSecret("supabase_url"))?.value ?? "",
  (await vault.fetchSecret("supabase_anon_key"))?.value ?? "",
  (await vault.fetchSecret("openai_api_key"))?.value ?? "",
];

initRoute({
  pineconeSK,
  supabaseURL,
  supabaseSK,
  openAIApiKey,
  indexName: "multilingual-e5-large",
});
app.use("/", v1);

app.listen(42000, () => {
  console.log("App listening on port 42000");
});

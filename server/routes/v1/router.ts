import express from "express";
import createOpenAIEmbeddings from "../../lib/embeddings.js";
import getPineconeHandler, { PineconeHandler } from "../../lib/handlers.js";
import Recapper from "../../lib/recapper.js";
import createLoginPage from "../../views/login.js";
import createRecallPage from "../../views/recall.js";
import createRecapPage from "../../views/recap.js";
import createRecordPage from "../../views/record.js";
import createRemindPage from "../../views/remind.js";

const router = express.Router();

var handler: PineconeHandler;

export const initRoute = (opt: {
  pineconeSK: string;
  supabaseURL: string;
  supabaseSK: string;
  indexName: string;
  openAIApiKey: string;
}) => {
  // db = new PineconeHandler(opt.pineconeSK, opt.indexName);
  const embeddings = createOpenAIEmbeddings({ openAIApiKey: opt.openAIApiKey });

  (async () => {
    const pc = await getPineconeHandler({
      embeddings,
      indexName: opt.indexName,
      apiKey: opt.pineconeSK,
    });
    handler = pc;
  })();
};

router.get("/", (req, res) => {
  res.send(createLoginPage());
});

router.get("/login", (req, res) => {
  res.send(createLoginPage());
});

router.get("/home", (req, res) => {
  res.send(createRecordPage());
});

router
  .route("/record")
  .get((req, res) => res.send(createRecordPage()))
  .post((req, res, next) => {
    handler.insert(req.body.notes);
    res.send(createRecordPage());
  })
  .put((req, res, next) => {
    next(new Error("Not Implemented"));
  });

router
  .route("/recap")
  .get((req, res) => res.send(createRecapPage()))
  .post((req, res, next) => {
    // next(new Error("Not Implemented"));
    const recapper = new Recapper(handler);
    const timespan = req.body.timespan;
    const query = req.body.query;
    // res.send(JSON.stringify(recapper.getFilter(timespan)));
    (async () => {
      const result = await recapper.recap(timespan, query);
      console.log(result);
    })();
    res.sendStatus(200);
  });

router
  .route("/recall")
  .get((req, res) => res.send(createRecallPage()))
  .post((req, res, next) => {
    next(new Error("Not Implemented"));
  });

router
  .route("/remind")
  .get((req, res) => res.send(createRemindPage()))
  .post((req, res, next) => {
    next(new Error("Not Implemented"));
  });

export default router;

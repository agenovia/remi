import express from "express";
import { PineconeHandler } from "../../src/handlers.js";
import createLoginPage from "../../views/login.js";
import createRecallPage from "../../views/recall.js";
import createRecapPage from "../../views/recap.js";
import createRecordPage from "../../views/record.js";
import createRemindPage from "../../views/remind.js";

const router = express.Router();

var options = {};
var db: PineconeHandler;

export const initRoute = (opt: {
  pineconeSK: string;
  supabaseURL: string;
  supabaseSK: string;
  indexName: string;
}) => {
  options = opt;
  db = new PineconeHandler(opt.pineconeSK, opt.indexName);
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
  .all((req, res, next) => next())
  .get((req, res) => res.send(createRecordPage()))
  .post((req, res, next) => {
    db.upsert(req.body.notes);
    res.send(createRecordPage());
  })
  .put((req, res, next) => {
    next(new Error("Not Implemented"));
  });

router
  .route("/recap")
  .all((req, res, next) => next())
  .get((req, res) => res.send(createRecapPage()))
  .post((req, res, next) => {
    next(new Error("Not Implemented"));
  });

router
  .route("/recall")
  .all((req, res, next) => next())
  .get((req, res) => res.send(createRecallPage()))
  .post((req, res, next) => {
    next(new Error("Not Implemented"));
  });

router
  .route("/remind")
  .all((req, res, next) => next())
  .get((req, res) => res.send(createRemindPage()))
  .post((req, res, next) => {
    next(new Error("Not Implemented"));
  });

export default router;

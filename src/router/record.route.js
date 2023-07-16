const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const { findTestRecordByUid } = require("../controller/testRecord.controller");
const {
  findTrainRecordByUid,
} = require("../controller/trainRecord.controller");

const router = new Router({ prefix: "/record" });

router.get("/get_single_test", auth,   async (ctx, next) => {
    ctx.state.mode = "single";
    await next();
  },findTestRecordByUid);

router.get(
  "/get_multiple_test",
  auth,
  async (ctx, next) => {
    ctx.state.mode = "multiple";
    await next();
  },
  findTestRecordByUid
);

router.get("/get_train", auth, findTrainRecordByUid);

module.exports = router;

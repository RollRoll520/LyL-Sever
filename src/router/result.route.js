const Router = require("koa-router");
const { auth, testEntry } = require("../middleware/auth.middleware");
const { getUserTestResult, downloadTestResult, getSingleTestResult } = require("../controller/testResult.controller");
const { getUserTrainResult } = require("../controller/trainResult.controller");

const router = new Router({ prefix: "/result" });

router.get("/get_test/:record_id", auth, getUserTestResult);

router.get("/get_single_test/:record_id", auth, getSingleTestResult);

router.get(
  "/get_train_heat/:record_id",
  auth,
  async (ctx, next) => {
    ctx.state.type = "train_heat";
    await next();
  },
  getUserTrainResult
);
router.get(
  "/get_train_report/:record_id",
  auth,
  async (ctx, next) => {
    ctx.state.type = "train_report";
    await next();
  },
  getUserTrainResult
);
router.get(
  "/get_validate_report/:record_id",
  auth,
  async (ctx, next) => {
    ctx.state.type = "validate_report";
    await next();
  },
  getUserTrainResult
);
router.get(
  "/get_validate_heat/:record_id",
  auth,
  async (ctx, next) => {
    ctx.state.type = "validate_heat";
    await next();
  },
  getUserTrainResult
);
router.get("/download_test/:record_id", auth, downloadTestResult);

module.exports = router;

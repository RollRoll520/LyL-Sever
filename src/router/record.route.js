const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const { findTestRecordByUid } = require("../controller/testRecord.controller");
const {
  findTrainRecordByUid,
} = require("../controller/trainRecord.controller");

const router = new Router({ prefix: "/record" });

router.get("/getTest", auth, findTestRecordByUid);
router.get("/getTrain", auth, findTrainRecordByUid);

module.exports = router;

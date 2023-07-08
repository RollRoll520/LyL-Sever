const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const {
  updateTrainRecord,
  findTrainRecordByUid,
  createTrainRecord,
} = require("../controller/trainRecord.controller");

const router = new Router({ prefix: "/trainRecord" });

router.post("/create", auth, createTrainRecord);
router.post("/update", auth, updateTrainRecord);
router.get("/getByUid", auth, findTrainRecordByUid);

module.exports = router;

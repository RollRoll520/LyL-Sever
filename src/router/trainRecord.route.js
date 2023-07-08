const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const {
  findTrainRecordByUid,
} = require("../controller/trainRecord.controller");

const router = new Router({ prefix: "/trainRecord" });

//create、update方法不提供给前端
// router.post("/create", auth, createTrainRecord);
// router.post("/update", auth, updateTrainRecord);

router.get("/getByUid", auth, findTrainRecordByUid);

module.exports = router;

const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const {
  findTestRecordByUid,
} = require("../controller/testRecord.controller");

const router = new Router({ prefix: "/testRecord" });

//create、update方法不提供给前端
// router.post("/create", auth, createTestRecord);
// router.post("/update", auth,updateTestRecord);
router.get("/getByUid",auth,findTestRecordByUid);

module.exports = router;

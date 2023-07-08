const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const {
  updateTestRecord,
  findTestRecordByUid,
  createTestRecord,
} = require("../controller/testRecord.controller");

const router = new Router({ prefix: "/testRecord" });

router.post("/create", auth, createTestRecord);
router.post("/update", auth,updateTestRecord);
router.get("/getByUid",auth,findTestRecordByUid);

module.exports = router;

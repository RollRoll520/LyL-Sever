const Router = require("koa-router");
const { auth, testEntry } = require("../middleware/auth.middleware");
const { getUserTestResult } = require("../controller/testResult.controller");
const { getUserTrainResult } = require("../controller/trainResult.controller");

const router = new Router({ prefix: "/result" });

router.get("/getTest/:record_id",testEntry,  getUserTestResult);
router.get("/getTrain/:record_id",testEntry, getUserTrainResult);

module.exports = router;

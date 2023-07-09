const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const { getUserTestResult } = require("../controller/testResult.controller");
const { getUserTrainResult } = require("../controller/trainResult.controller");

const router = new Router({ prefix: "/result" });

router.get("/getTest/:record_id",auth,  getUserTestResult);
router.get("/getTrain/:record_id",auth, getUserTrainResult);

module.exports = router;

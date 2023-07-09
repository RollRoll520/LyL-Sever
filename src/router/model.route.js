const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const {  trainModel, testModel, getModel } = require("../controller/model.controller");
const { getTestSetInfo, getTrainSetInfo } = require("../middleware/model.middleware");
const { createTrainRecord, updateTrainRecord } = require("../controller/trainRecord.controller");
const { createTestRecord, updateTestRecord } = require("../controller/testRecord.controller");
const { createTestResult } = require("../controller/testResult.controller");
const { createTrainResult } = require("../controller/trainResult.controller");


const router = new Router({ prefix: "/model" });

router.post("/train",auth,getTrainSetInfo,createTrainRecord,trainModel,updateTrainRecord,createTrainResult);

router.post("/defaultTest",auth,getTestSetInfo,createTestRecord,testModel,updateTestRecord,createTestResult);

router.get("/download",auth,getModel);

module.exports = router;

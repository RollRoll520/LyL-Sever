const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const {
  trainModel,
  testDefaultModel,
  getModel,
  testCustomModel,
  getCustomModel,
} = require("../controller/model.controller");
const {
  getTestSetInfo,
  getTrainSetInfo,
  trainValidator,
  defaultTestValidator,
  customTestValidator,
} = require("../middleware/model.middleware");
const {
  createTrainRecord,
  updateTrainRecord,
} = require("../controller/trainRecord.controller");
const {
  createTestRecord,
  updateTestRecord,
} = require("../controller/testRecord.controller");
const { createTestResult } = require("../controller/testResult.controller");
const { createTrainResult } = require("../controller/trainResult.controller");
const { datasetState2isFinished } = require("../controller/dataset.controller");

const router = new Router({ prefix: "/model" });

router.post(
  "/train",
  auth,
  trainValidator,
  getTrainSetInfo,
  createTrainRecord,
  trainModel,
  updateTrainRecord,
  datasetState2isFinished,
  createTrainResult
);

//默认的在线测试服务
router.post(
  "/defaultTest",
  auth,
  defaultTestValidator,
  getTestSetInfo,
  createTestRecord,
  testDefaultModel,
  updateTestRecord,
  datasetState2isFinished,
  createTestResult
);

//根据用户上传的模型进行测试
router.post(
  "/customTest",
  auth,
  customTestValidator,
  getTestSetInfo,
  getCustomModel,
  createTestRecord,
  testCustomModel,
  updateTestRecord,
  datasetState2isFinished,
  createTestResult
);

//获取默认模型
router.get("/download", auth, getModel);

module.exports = router;

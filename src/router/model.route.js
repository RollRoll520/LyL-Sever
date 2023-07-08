const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const {  trainModel, testModel, getModel } = require("../controller/model.controller");
const { getTestSetInfo, getTrainSetInfo } = require("../middleware/model.middleware");


const router = new Router({ prefix: "/model" });

router.post("/train",auth,getTrainSetInfo,trainModel );

router.post("/test",auth,getTestSetInfo,testModel);

router.get("/download",auth,getModel);

module.exports = router;

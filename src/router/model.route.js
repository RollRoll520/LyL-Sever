const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const { trainHandler, testHandler } = require("../controller/model.controller");
const { getTestSetInfo, getTrainSetInfo } = require("../middleware/model.middleware");


const router = new Router({ prefix: "/model" });

router.post("/train",auth,getTrainSetInfo,trainHandler );

router.post("/test",auth,getTestSetInfo,testHandler);

// router.get("/download", auth,modelController.getModel);

module.exports = router;

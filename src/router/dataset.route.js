const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const {
  datasetValidator,
  unlinkDatasetValidator,
} = require("../middleware/dataset.middleware");
const {
  createDataset,
  upload,
  getTrainSet,
  unlinkDataset,
  datasetState2isExpired,
  getSingleTestSet,
  getMultipleTestSet,
  getValidateSet,
} = require("../controller/dataset.controller");

const router = new Router({ prefix: "/dataset" });

router.post("/new", auth, datasetValidator, upload, createDataset);

router.get("/get_single_test", auth, getSingleTestSet);

router.get("/get_multiple_test",auth,getMultipleTestSet);

router.get("/get_train", auth, getTrainSet);

router.get("/get_validate",auth,getValidateSet);

router.post("/unlink", auth, unlinkDatasetValidator,unlinkDataset, datasetState2isExpired);

module.exports = router;

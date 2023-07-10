const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const {
  datasetValidator,
  unlinkDatasetValidator,
} = require("../middleware/dataset.middleware");
const {
  createDataset,
  upload,
  getTestSet,
  getTrainSet,
  unlinkDataset,
  datasetState2isExpired,
} = require("../controller/dataset.controller");

const router = new Router({ prefix: "/dataset" });

router.post("/new", auth, datasetValidator, upload, createDataset);

router.get("/getTest", auth, getTestSet);

router.get("/getTrain", auth, getTrainSet);

router.post("/unlink", auth, unlinkDatasetValidator,unlinkDataset, datasetState2isExpired);

module.exports = router;

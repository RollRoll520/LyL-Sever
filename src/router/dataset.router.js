const Router = require("koa-router");
const { auth } = require("../middleware/auth.middleware");
const { datasetValidator } = require("../middleware/dataset.middleware");
const { createDataset, upload } = require("../controller/dataset.controller");

const router = new Router({ prefix: "/dataset" });

router.post("/new", auth, datasetValidator, upload, createDataset);

module.exports = router;

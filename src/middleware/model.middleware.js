const { findTrainSetError, findTestSetError } = require("../const/err.type");
const { findLatestDatasetByUidAndType } = require("../service/dataset.service");

const getTrainSetInfo = async (ctx, next) => {
  try {
    const { id: u_id } = ctx.state.user;
    const res = await findLatestDatasetByUidAndType(u_id, "train");
    ctx.state.path = res.path;
  } catch (err) {
    console(err);
    findTrainSetError.result = err;
    return ctx.app.emit("error", findTrainSetError, ctx);
  }
  await next();
};

const getTestSetInfo = async (ctx, next) => {
  try {
    const { id: u_id } = ctx.state.user;
    const res = await findLatestDatasetByUidAndType(u_id, "test");
    ctx.state.path = res.path;
  } catch (err) {
    console(err);
    findTestSetError.result = err;
    return ctx.app.emit("error", findTestSetError, ctx);
  }
  await next();
};

module.exports = {
  getTestSetInfo,
  getTrainSetInfo,
};

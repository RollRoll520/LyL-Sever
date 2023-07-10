const {
  findTrainSetError,
  findTestSetError,
  trainModelFormatError,
  customTestFormatError,
  defaultTestFormatError,
} = require("../const/err.type");
const { findDatasetById } = require("../service/dataset.service");

const getTrainSetInfo = async (ctx, next) => {
  try {
    const { dataset_id } = ctx.request.body;
    const { id } = ctx.state.user;
    const res = await findDatasetById(dataset_id);
    if (res == null) {
      const error = "不存在的训练集！";
      throw error;
    }
    if (res.type == "test") {
      const error = "无法使用测试集进行训练！";
      throw error;
    }
    if (res.state == "isExpired") {
      const error = "无法使用已失效的训练集！";
      throw error;
    }
    if (id != res.u_id) {
      const error = "请使用自己的训练集进行训练！";
      throw error;
    }
    ctx.state.dataset_path = res.path;
    ctx.state.dataset_id = res.id;
    await next();
  } catch (err) {
    console.log(err);
    findTrainSetError.result = err;
    return ctx.app.emit("error", findTrainSetError, ctx);
  }
};

const getTestSetInfo = async (ctx, next) => {
  try {
    const { dataset_id } = ctx.request.body;
    const { id } = ctx.state.user;
    const res = await findDatasetById(dataset_id);
    if (res == null) {
      const error = "不存在的测试集！";
      throw error;
    }
    if (res.type == "train") {
      const error = "无法使用训练集进行测试！";
      throw error;
    }
    if (res.state == "isExpired") {
      const error = "无法使用已失效的测试集！";
      throw error;
    }

    if (id != res.u_id) {
      const error = "请使用自己的测试集进行测试！";
      throw error;
    }
    ctx.state.path = res.path;
    ctx.state.dataset_id = res.id;
    await next();
  } catch (err) {
    console.log(err);
    findTestSetError.result = err;
    return ctx.app.emit("error", findTestSetError, ctx);
  }
};

const trainValidator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      dataset_id: { type: "id", required: true },
      model_name: { type: "string", required: true },
    });
  } catch (err) {
    console.error(err);
    trainModelFormatError.result = err;
    return ctx.app.emit("error", trainModelFormatError, ctx);
  }
  await next();
};

const defaultTestValidator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      dataset_id: { type: "id", required: true },
    });
  } catch (err) {
    console.error(err);
    defaultTestFormatError.result = err;
    return ctx.app.emit("error", defaultTestFormatError, ctx);
  }
  await next();
};

const customTestValidator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      dataset_id: { type: "id", required: true },
      train_record_id: { type: "id", required: true },
    });
    await next();
  } catch (err) {
    console.error(err);
    customTestFormatError.result = err;
    return ctx.app.emit("error", customTestFormatError, ctx);
  }
};

module.exports = {
  getTestSetInfo,
  getTrainSetInfo,
  trainValidator,
  defaultTestValidator,
  customTestValidator,
};

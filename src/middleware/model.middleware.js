const {
  findTrainSetError,
  findTestSetError,
  trainModelFormatError,
  customTestFormatError,
  defaultTestFormatError,
  downloadModelFormatError,
} = require("../const/err.type");
const { findDatasetById } = require("../service/dataset.service");

const getTrainSetInfo = async (ctx, next) => {
  try {
    const { train_set_id, validate_set_id } = ctx.request.body;
    const { id } = ctx.state.user;
    const res = await findDatasetById(train_set_id);
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
    const res2 = await findDatasetById(validate_set_id);
    if (res2 == null) {
      const error = "不存在的验证集！";
      throw error;
    }
    if (res2.type == "test") {
      const error = "无法使用测试集进行训练！";
      throw error;
    }
    if (res2.state == "isExpired") {
      const error = "无法使用已失效的验证集！";
      throw error;
    }
    if (id != res2.u_id) {
      const error = "请使用自己的验证集进行训练！";
      throw error;
    }
    ctx.state.train_set_path = res.path;
    ctx.state.validate_set_path = res2.path;
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
    if (res.type == "train"||res.type=="validate") {
      const error = "无法使用训练数据进行测试！";
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
      train_set_id: { type: "id", required: true },
      validate_set_id: { type: "id", required: true },
      remark: { type: "string", required: false },
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
      remark:{type:"string",require:true},
      mode:{type:"string",require:true}
    });
    await next();
  } catch (err) {
    console.error(err);
    customTestFormatError.result = err;
    return ctx.app.emit("error", customTestFormatError, ctx);
  }
};

const getModelValidator = async (ctx, next) => {
  try {
    ctx.verifyParams({
      train_record_id: { type: "id", required: true },
    });
    await next();
  } catch (err) {
    console.error(err);
    downloadModelFormatErrorModelFormatError.result = err;
    return ctx.app.emit("error", downloadModelFormatError, ctx);
  }
};

module.exports = {
  getTestSetInfo,
  getTrainSetInfo,
  trainValidator,
  defaultTestValidator,
  customTestValidator,
  getModelValidator,
};

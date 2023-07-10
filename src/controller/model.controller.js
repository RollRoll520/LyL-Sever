const path = require("path");
const fs = require("fs");
const { runPythonScript } = require("../service/model.service");
const {
  modelTestError,
  modelTrainError,
  getCustomModelError,
  downloadModelError,
} = require("../const/err.type");
const {
  DEFAULT_MODEL_PATH,
  TEST_PYTHON_PATH,
  TRAIN_PYTHON_PATH,
  TEST_RESULT_DIR,
} = require("../config/config.default");
const { getTrainResultsByRecordId } = require("../service/trainResult.service");

class ModelController {
  async trainModel(ctx, next) {
    const pyFilePath = path.join(__dirname, TRAIN_PYTHON_PATH); // 指定 Python 脚本的路径
    const datasetPath = ctx.state.dataset_path; // 训练集文件路径
    const modelPath = path.join(__dirname, DEFAULT_MODEL_PATH); // 模型文件路径

    try {
      // 执行 Python 脚本并等待结果
      const result = await runPythonScript(ctx, pyFilePath, [
        datasetPath,
        modelPath,
      ]);
      ctx.state.model_path = path.join(__dirname, DEFAULT_MODEL_PATH);

      await next();
    } catch (error) {
      // 将错误信息作为响应返回给前端
      console.error(error);
      ctx.app.emit("error", modelTrainError, ctx);
    }
  }

  async testDefaultModel(ctx, next) {
    console.log("start test");
    const { id: u_id, username } = ctx.state.user;
    const pyFilePath = path.join(__dirname, TEST_PYTHON_PATH); // 指定 Python 脚本的路径
    const testSetPath = ctx.state.path; // 测试集文件路径

    const now = new Date();
    // 格式化当前时间为指定的字符串格式
    const formattedTimeStr = now
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .match(/\d+/g) // 匹配连续的数字
      .join(""); // 将数字拼接成一个字符串

    const resultDir = path.join(
      __dirname,
      TEST_RESULT_DIR,
      `${u_id}_${username}`
    ); // 测试结果文件路径
    if (!fs.existsSync(resultDir)) {
      fs.mkdirSync(resultDir);
    }
    const resultPath = path.join(
      resultDir,
      `${username}_${formattedTimeStr}.json`
    );
    const modelFile = path.join(__dirname, DEFAULT_MODEL_PATH); // 模型文件路径

    try {
      // 执行 Python 脚本并等待结果
      const result = await runPythonScript(ctx, pyFilePath, [
        testSetPath,
        resultPath,
        modelFile,
      ]);
      ctx.state.test_result = result;
      ctx.state.result_path = resultPath;
      ctx.state.result_name = `${username}_${formattedTimeStr}.json`;
      // 将 Python 脚本的输出作为响应返回给前端

      await next();
    } catch (error) {
      // 将错误信息作为响应返回给前端
      console.error(error);
      ctx.app.emit("error", modelTestError, ctx);
    }
  }

  async testCustomModel(ctx, next) {
    console.log("start test");
    const { id: u_id, username } = ctx.state.user;
    const pyFilePath = path.join(__dirname, TEST_PYTHON_PATH); // 指定 Python 脚本的路径
    const testSetPath = ctx.state.path; // 测试集文件路径

    const now = new Date();
    // 格式化当前时间为指定的字符串格式
    const formattedTimeStr = now
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .match(/\d+/g) // 匹配连续的数字
      .join(""); // 将数字拼接成一个字符串

    const resultDir = path.join(
      __dirname,
      TEST_RESULT_DIR,
      `${u_id}_${username}`
    ); // 测试结果文件路径
    if (!fs.existsSync(resultDir)) {
      fs.mkdirSync(resultDir);
    }
    const resultPath = path.join(
      resultDir,
      `${username}_${formattedTimeStr}.json`
    );
    const modelFile = path.join(__dirname, DEFAULT_MODEL_PATH); // 模型文件路径

    try {
      // 执行 Python 脚本并等待结果
      const result = await runPythonScript(ctx, pyFilePath, [
        testSetPath,
        resultPath,
        modelFile,
      ]);
      ctx.state.test_result = result;
      ctx.state.result_path = resultPath;
      ctx.state.result_name = `${username}_${formattedTimeStr}.json`;
      await next();
      // 将 Python 脚本的输出作为响应返回给前端
    } catch (error) {
      // 将错误信息作为响应返回给前端
      console.error(error);
      ctx.app.emit("error", modelTestError, ctx);
    }
  }

  async getCustomModel(ctx, next) {
    const { train_record_id } = ctx.request.body;
    try {
      const res = await getTrainResultsByRecordId(train_record_id);
      console.log(res);
      // await next();
    } catch (err) {
      console.log(err);
      getCustomModelError.result = err;
      return ctx.app.emit("error", getCustomModelError, ctx);
    }
  }

  async downloadDefaultModel(ctx, next) {
    const filepath = path.join(__dirname, DEFAULT_MODEL_PATH);

    const stat = fs.statSync(filepath);

    // 设置响应头，告诉浏览器响应体的类型和附件的名称
    ctx.set("Content-Type", "application/octet-stream");
    ctx.set(
      "Content-Disposition",
      `attachment; filename="${path.basename(filepath)}"`
    );
    ctx.set("Content-Length", stat.size);

    // 将模型文件作为响应体发送给客户端
    ctx.body = fs.createReadStream(filepath);

    await next();
  }

  async downloadCustomModel(ctx, next) {
    const { train_record_id } = ctx.params;
    try {
      const res = await getTrainResultsByRecordId(train_record_id);
      const filepath = res.modelPath;

      const stat = fs.statSync(filepath);

      ctx.set("Content-Type", "application/octet-stream");
      ctx.set(
        "Content-Disposition",
        `attachment; filename="${path.basename(filepath)}"`
      );
      ctx.set("Content-Length", stat.size);

      ctx.body = fs.createReadStream(filepath);

      await next();
    } catch (err) {
      console.log(err);
      downloadModelError.result = err;
      ctx.app.emit("error",downloadModelError,ctx);
    }
  }
}

module.exports = new ModelController();

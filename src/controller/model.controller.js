const path = require("path");
const fs = require("fs");
const { runPythonScript } = require("../service/model.service");
const { modelTestError, modelTrainError } = require("../const/err.type");

class ModelController {
  async trainHandler(ctx, next) {
    const pyFilePath = path.join(__dirname, `../../learn/train_model.py`); // 指定 Python 脚本的路径
    const datasetPath = ctx.state.path; // 训练集文件路径
    const modelPath = path.join(__dirname, `../../learn/model.joblib`); // 模型文件路径

    try {
      // 执行 Python 脚本并等待结果
      const result = await runPythonScript(ctx, pyFilePath, [
        datasetPath,
        modelPath,
      ]);
      // 将 Python 脚本的输出作为响应返回给前端
      ctx.body = {
        code: 0,
        message: "模型测试成功",
        result: result,
      };
    } catch (error) {
      // 将错误信息作为响应返回给前端
      console.error(error);
      ctx.app.emit("error", modelTrainError, ctx);
    }

    await next();
  }

  async testHandler(ctx, next) {
    console.log("start test");
    const { id: u_id, username } = ctx.state.user;
    const pyFilePath = path.join(__dirname, `../../learn/test_model.py`); // 指定 Python 脚本的路径
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
      `../../../test_result/${u_id}_${username}`
    ); // 测试结果文件路径
    if (!fs.existsSync(resultDir)) {
      fs.mkdirSync(resultDir);
    }
    const resultPath = path.join(
      resultDir,
      `${username}_${formattedTimeStr}.json`
    );
    const modelFile = path.join(__dirname, `../../learn/model.joblib`); // 模型文件路径

    try {
      // 执行 Python 脚本并等待结果
      const result = await runPythonScript(ctx, pyFilePath, [
        testSetPath,
        resultPath,
        modelFile,
      ]);
      // 将 Python 脚本的输出作为响应返回给前端
      ctx.body = {
        code: 0,
        message: "模型测试成功",
        result: result,
      };
    } catch (error) {
      // 将错误信息作为响应返回给前端
      console.error(error);
      ctx.app.emit("error", modelTestError, ctx);
    }

    await next();
  }
}

module.exports = new ModelController();

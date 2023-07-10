const {
  createTestResultError,
  getTestResultError,
} = require("../const/err.type");
const path = require("path");
const fs = require("fs");
const { getUserTestRecords } = require("../service/testRecord.service");
const {
  addTestResult,
  getTestResultsByRecordId,
} = require("../service/testResult.service");

class TestResultService {
  async createTestResult(ctx, next) {
    const { record_id, result_name, result_path, duration } = ctx.state;
    try {
      const res = await addTestResult(record_id, result_name, result_path);
      ctx.body = {
        code: 0,
        message: "模型测试成功",
        result: `测试时间:${duration.toFixed(2)} 秒`,
        duration: `${duration.toFixed(2)}`,
        resultFileName: res.filename,
      };
      await next();
    } catch (err) {
      console.log(err);
      createTestResultError.result = err;
      ctx.app.emit("error", createTestResultError, ctx);
    }
  }
  async getUserTestResult(ctx, next) {
    const { id: u_id } = ctx.state.user;
    const { record_id } = ctx.params;
    try {
      const records = await getUserTestRecords(u_id);
      const hasRecordId = records.some(
        (item) => item.id.toString() === record_id
      );
      if (hasRecordId) {
        const result = await getTestResultsByRecordId(record_id);
        const result_path = result[0].path;

        const stat = fs.statSync(result_path);
        // 设置响应头，告诉浏览器响应体的类型和附件的名称
        ctx.set("Content-Type", "application/json");
        ctx.set(
          "Content-Disposition",
          `attachment; filename="${path.basename(result_path)}"`
        );
        ctx.set("Content-Length", stat.size);

        // 将 JSON 字符串作为响应体发送给客户端
        ctx.body = fs.createReadStream(result_path);
      } else {
        getTestResultError.result = "测试结果不存在或不属于当前用户！";
        ctx.app.emit("error", getTestResultError, ctx);
      }
      await next();
    } catch (err) {
      console.log(err);
      getTestResultError.result = err;
      ctx.app.emit("error", getTestResultError, ctx);
    }
  }
}

module.exports = new TestResultService();

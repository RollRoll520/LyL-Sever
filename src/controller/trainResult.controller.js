const {
  createTrainResultError,
  getTrainResultError,
} = require("../const/err.type");
const path = require("path");
const fs = require("fs");
const { getUserTrainRecords } = require("../service/trainRecord.service");
const {
  addTrainResult,
  getTrainResultsByRecordId,
} = require("../service/trainResult.service");

class TrainResult {
  async createTrainResult(ctx, next) {
    const { record_id, model_name, model_path, duration } = ctx.state;
    try {
      const res = await addTrainResult(record_id, model_name, model_path);
      ctx.body = {
        code: 0,
        message: "模型训练成功",
        result: `训练时间:${duration.toFixed(2)} 秒`,
        duration: `${duration.toFixed(2)}`,
        resultModelName: res.modelName,
      };
    } catch (err) {
      console.log(err);
      createTrainResultError.result = err;
      ctx.app.emit("error", createTrainResultError, ctx);
    }
    await next();
  }

  async getUserTrainResult(ctx, next) {
    const { id: u_id } = ctx.state.user;
    const { record_id } = ctx.params;
    try {
      const records = await getUserTrainRecords(u_id);
      const hasRecordId = records.some(
        (item) => item.id.toString() === record_id
      );
      if (hasRecordId) {
        const result = await getTrainResultsByRecordId(record_id);
        const result_path = result[0].modelPath;

        const stat = fs.statSync(result_path);
        // 设置响应头，告诉浏览器响应体的类型和附件的名称
        ctx.set("Content-Type", "application/octet-stream");
        ctx.set(
          "Content-Disposition",
          `attachment; filename="${path.basename(result_path)}"`
        );
        ctx.set("Content-Length", stat.size);

        // 将 JSON 字符串作为响应体发送给客户端
        ctx.body = fs.createReadStream(result_path);
      } else {
        getTrainResultError.result = "训练模型不存在或不属于当前用户！";
        ctx.app.emit("error", getTrainResultError, ctx);
      }
    } catch (err) {
      console.log(err);
      getTrainResultError.result = err;
      ctx.app.emit("error", getTrainResultError, ctx);
    }
    await next();
  }
}

module.exports = new TrainResult();

const datasetService = require("../service/dataset.service");
const fs = require("fs");
const path = require("path");
const { datasetCreateError, datasetFormatError } = require("../const/err.type");

class DatasetController {
  //上传数据集
  async upload(ctx, next) {
    const { id: u_id, username } = ctx.state.user;
    const { type } = ctx.request.body;

    // 1. 获取上传文件的信息
    const tempFile = ctx.request.files.dataset;
    console.log(tempFile);

    // 2. 校验文件格式
    const extname = path.extname(tempFile.originalFilename).toLowerCase();
    if (extname !== ".csv") {
      console.error("上传文件格式不正确");
      ctx.app.emit("error", datasetFormatError, ctx);
      reject(null);
      return;
    }

    // 将文件保存到指定目录下
    const targetDir =
      type == "test"
        ? path.join(__dirname, `../../../test_dataset/${u_id}_${username}`)
        : path.join(__dirname, `../../../train_dataset/${u_id}_${username}`);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir);
    }
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

    const targetPath = path.join(
      targetDir,
      `${username}_${formattedTimeStr}.csv`
    );
    fs.renameSync(tempFile.filepath, targetPath);

    ctx.state.path = targetPath;
    console.log(targetPath);

    await next();
  }

  //创建数据集记录
  async createDataset(ctx, next) {
    const { type } = ctx.request.body;
    const { id } = ctx.state.user;
    const { path: filePath } = ctx.state;
    console.log(filePath);
    const dataset = {
      u_id: id,
      type,
      filename: path.basename(filePath),
      path: filePath,
    };

    // 1. 创建数据集记录
    try {
      const res = await datasetService.createDataset(dataset);

      ctx.body = {
        code: 0,
        message: "数据集创建成功",
        result: {
          id: res.id,
          name: res.name,
          type: res.type,
          upload_time: res.upload_time,
        },
      };
    } catch (err) {
      console.error(err);
      ctx.app.emit("error", datasetCreateError, ctx);
    }
  }
}

module.exports = new DatasetController();

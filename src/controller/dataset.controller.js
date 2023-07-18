const datasetService = require("../service/dataset.service");
const fs = require("fs");
const path = require("path");
const {
  datasetCreateError,
  datasetFormatError,
  findTrainSetError,
  updateDatasetStateError,
  unlinkDatasetError,
  findValidateSetError,
  findSingleTestSetError,
  findMultipleTestSetError,
} = require("../const/err.type");
const {
  SINGLE_TEST_DIR,
  MULTIPLE_TEST_DIR,
  VALIDATE_DATASET_DIR,
  TRAIN_DATASET_DIR,
} = require("../config/config.default");
const { getUserInfo } = require("../service/user.service");

class DatasetController {
  //上传数据集
  async upload(ctx, next) {
    try {
      const { id: u_id, username } = ctx.state.user;
      const { type } = ctx.request.body;

      // 1. 获取上传文件的信息
      const tempFile = ctx.request.files.dataset;

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
        type == "single_test"
          ? path.join(__dirname, SINGLE_TEST_DIR, `${u_id}`)
          : type == "mul_test"
          ? path.join(__dirname, MULTIPLE_TEST_DIR, `${u_id}`)
          : type == "validate"
          ? path.join(__dirname, VALIDATE_DATASET_DIR, `${u_id}`)
          : path.join(__dirname, TRAIN_DATASET_DIR, `${u_id}`);
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
        `${u_id}_${formattedTimeStr}.csv`
      );
      fs.renameSync(tempFile.filepath, targetPath);

      ctx.state.path = targetPath;
      console.log(targetPath);

      await next();
    } catch (err) {
      console.log(err);
      datasetCreateError.result = err;
      return ctx.app.emit("error", datasetCreateError, ctx);
    }
  }

  async unlinkDataset(ctx, next) {
    const { id } = ctx.request.body;
    const { id: u_id } = ctx.state.user;
    try {
      const res1 = await datasetService.findDatasetById(id);
      console.log(res1);
      const res2 = await getUserInfo(u_id);
      if (res1.state == "isExpired") {
        const error = "删除失败！文件不存在！";
        throw error;
      } else if (res2.role == "admin" || u_id == res1.u_id)
        fs.unlink(res1.path, (err) => {
          if (err) {
            throw err;
          } else {
            console.log(`${res1.path} has been deleted`);
          }
        });
      else {
        const error = "删除失败！权限不足！";
        throw error;
      }
      await next();
    } catch (err) {
      console.log(err);
      unlinkDatasetError.result = err;
      ctx.app.emit("error", unlinkDatasetError, ctx);
    }
  }

  //创建数据集记录
  async createDataset(ctx, next) {
    const { type, remark } = ctx.request.body;
    const { id: u_id } = ctx.state.user;
    const { path: filePath } = ctx.state;

    //编号
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var day = now.getDate();
    const dateInt = parseInt(
      year.toString().slice(-2) +
        month.toString().padStart(2, "0") +
        day.toString().padStart(2, "0")
    );

    const serialNumber = await datasetService.maxDatasetId(dateInt);

    const id = `${dateInt}${String(serialNumber).padStart(3, "0")}`;

    const dataset = {
      id,
      u_id,
      type,
      filename: path.basename(filePath), //todo:删除该字段
      path: filePath,
      remark,
      state: "isWaiting",
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
          remark: res.remark,
          state: res.state,
        },
      };
      await next();
    } catch (err) {
      console.error(err);
      ctx.app.emit("error", datasetCreateError, ctx);
    }
  }

  async getSingleTestSet(ctx, next) {
    const { id: u_id } = ctx.state.user;
    try {
      const res = await datasetService.findDatasetsByUidAndType(
        u_id,
        "single_test"
      );
      ctx.body = {
        code: 0,
        message: "获取单条测试集成功",
        result: res,
        count: res.length,
      };
      await next();
    } catch (err) {
      console.log(err);
      findSingleTestSetError.result = err;
      ctx.app.emit("error", findSingleTestSetError, ctx);
    }
  }

  async getMultipleTestSet(ctx, next) {
    const { id: u_id } = ctx.state.user;
    try {
      const res = await datasetService.findDatasetsByUidAndType(
        u_id,
        "mul_test"
      );
      ctx.body = {
        code: 0,
        message: "获取多条测试集成功",
        result: res,
        count: res.length,
      };
      await next();
    } catch (err) {
      console.log(err);
      findMultipleTestSetError.result = err;
      ctx.app.emit("error", findMultipleTestSetError, ctx);
    }
  }

  async getTrainSet(ctx, next) {
    const { id: u_id } = ctx.state.user;
    try {
      const res = await datasetService.findDatasetsByUidAndType(u_id, "train");
      ctx.body = {
        code: 0,
        message: "获取训练数据集成功",
        result: res,
        count: res.length,
      };
      await next();
    } catch (err) {
      console.log(err);
      findTrainSetError.result = err;
      ctx.app.emit("error", findTrainSetError, ctx);
    }
  }

  async getValidateSet(ctx, next) {
    const { id: u_id } = ctx.state.user;
    try {
      const res = await datasetService.findDatasetsByUidAndType(
        u_id,
        "validate"
      );
      ctx.body = {
        code: 0,
        message: "获取验证数据集成功",
        result: res,
        count: res.length,
      };
      await next();
    } catch (err) {
      console.log(err);
      findValidateSetError.result = err;
      ctx.app.emit("error", findValidateSetError, ctx);
    }
  }

  async datasetState2isExpired(ctx, next) {
    const { id } = ctx.request.body;
    try {
      const res = await datasetService.updateDatasetState(id, "isExpired");
      ctx.body = {
        code: 0,
        message: "停用数据集成功",
        id: res.id,
        state: res.state,
      };
      await next();
    } catch (err) {
      console.log(err);
      updateDatasetStateError.result = err;
      ctx.app.emit("error", updateDatasetStateError, ctx);
    }
  }

  async trainSetState2isFinished(ctx, next) {
    const { train_set_id, validate_set_id } = ctx.request.body;

    try {
      await datasetService.updateDatasetState(train_set_id, "isFinished");
      await datasetService.updateDatasetState(validate_set_id, "isFinished");
      await next();
    } catch (err) {
      console.log(err);
      updateDatasetStateError.result = err;
      ctx.app.emit("error", updateDatasetStateError, ctx);
    }
  }

  async datasetState2isFinished(ctx, next) {
    const { dataset_id } = ctx.request.body;

    try {
      await datasetService.updateDatasetState(dataset_id, "isFinished");
      await next();
    } catch (err) {
      console.log(err);
      updateDatasetStateError.result = err;
      ctx.app.emit("error", updateDatasetStateError, ctx);
    }
  }
}

module.exports = new DatasetController();

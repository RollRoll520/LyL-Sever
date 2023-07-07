const { DataTypes } = require("sequelize");
const seq = require("../database/seq.mysql");

// TrainResult 训练结果表
const TrainResult = seq.define(
  "TrainResult",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "训练结果ID",
    },
    train_record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "训练记录的编号",
      references: {
        model: TrainRecord,
        key: "id",
      },
    },
    modelName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "模型训练生成的模型文件名",
    },
    modelPath: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "模型训练生成的模型文件所在路径",
    },
  },
  {
    timestamps: false,
    tableName: "TrainResult",
  }
);

TrainResult.belongsTo(TrainRecord, { foreignKey: "train_record_id" });

module.exports = TrainResult;

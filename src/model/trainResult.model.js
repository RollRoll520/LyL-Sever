const { DataTypes } = require("sequelize");
const seq = require("../database/seq.mysql");
const TrainRecord = require("./trainRecord.model");

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
    model_name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "模型训练生成的模型文件名",
    },
    model_path: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "模型训练生成的模型文件所在路径",
    },
    train_report_path: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "训练集报告数据",
    },
    train_heat_path: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "训练集热力图数据",
    },
    validate_report_path: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "验证集报告数据",
    },
    validate_heat_path: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "验证集热力图数据",
    },
  },
  {
    timestamps: false,
    tableName: "TrainResult",
  }
);

TrainResult.belongsTo(TrainRecord, { foreignKey: "train_record_id" });

module.exports = TrainResult;

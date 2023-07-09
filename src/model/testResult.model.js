const { DataTypes } = require("sequelize");
const seq = require("../database/seq.mysql");
const TestRecord = require("./testRecord.model");

// TestResult 测试结果表
const TestResult = seq.define(
  "TestResult",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "测试结果ID",
    },
    test_record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "测试记录的编号",
      references: {
        model: TestRecord,
        key: "id",
      },
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "模型测试生成的结果文件名",
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "模型测试生成的结果文件所在路径",
    },
  },
  {
    timestamps: false,
    tableName: "TestResult",
  }
);

TestResult.belongsTo(TestRecord, { foreignKey: "test_record_id" });

module.exports= TestResult;
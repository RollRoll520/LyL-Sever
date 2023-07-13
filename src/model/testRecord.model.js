const { DataTypes } = require("sequelize");
const seq = require("../database/seq.mysql");
const Dataset = require("./dataset.model");
const User = require("./user.model");

// TestRecord 测试记录表
const TestRecord = seq.define(
  "TestRecord",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "测试记录ID",
    },
    dataset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "测试所使用的数据集的编号",
      references: {
        model: Dataset,
        key: "id",
      },
    },
    u_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "测试者的ID",
      references: {
        model: User,
        key: "id",
      },
    },
    mode: {
      type: DataTypes.ENUM("single", "multiple"),
      defaultValue: "single",
      allowNull: false,
      comment: "测试模式",
    },
    isExpired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "测试记录是否有效",
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "测试记录备注",
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "测试开始时间",
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: "测试结束时间",
    },
  },
  {
    timestamps: false,
    tableName: "TestRecord",
  }
);

TestRecord.belongsTo(Dataset, { foreignKey: "dataset_id" });
TestRecord.belongsTo(User, { foreignKey: "u_id" });

module.exports = TestRecord;

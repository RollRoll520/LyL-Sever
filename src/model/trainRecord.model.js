const { DataTypes } = require("sequelize");
const seq = require("../database/seq.mysql");
const Dataset = require("./dataset.model");
const User = require("./user.model");

// TrainRecord 训练记录表
const TrainRecord = seq.define(
  "TrainRecord",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "训练记录ID",
    },
    train_set_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "训练所使用的训练集的编号",
      references: {
        model: Dataset,
        key: "id",
      },
    },
    validate_set_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "训练所使用的验证集的编号",
      references: {
        model: Dataset,
        key: "id",
      },
    },
    u_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "训练者的ID",
      references: {
        model: User,
        key: "id",
      },
    },
    isExpired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "训练记录是否已失效",
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "训练记录备注",
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "训练开始时间",
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
      comment: "训练结束时间",
    },
  },
  {
    timestamps: false,
    tableName: "TrainRecord",
  }
);

TrainRecord.belongsTo(Dataset, { foreignKey: "train_set_id" });
TrainRecord.belongsTo(Dataset, { foreignKey: "validate_set_id" });
TrainRecord.belongsTo(User, { foreignKey: "u_id" });

module.exports = TrainRecord;

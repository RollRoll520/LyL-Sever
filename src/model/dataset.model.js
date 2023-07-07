const { DataTypes } = require("sequelize");
const seq = require("../database/seq.mysql");

// Dataset 数据集表
const Dataset = seq.define(
  "Dataset",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "数据集ID",
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "数据集名称",
    },
    u_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "数据集上传者的用户名",
      references: {
        model: User,
        key: "id",
      },
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "数据集文件名",
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "数据集路径",
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "数据集类型",
    },
    upload_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "数据集上传时间",
    },
  },
  {
    timestamps: false,
    tableName: "Dataset",
  }
);

Dataset.belongsTo(User, { foreignKey: "u_id" });

module.exports = Dataset;
// User 用户表
const { DataTypes } = require("sequelize");
const seq = require("../database/seq.mysql");

const User = seq.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: "用户ID",
    },
    username: {
      type: DataTypes.STRING,
      primaryKey: false,
      allowNull: false,
      comment: "用户用户名",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "用户密码",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "用户电子邮件",
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "用户身份",
    },
    register_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: "用户注册时间",
    },
  },
  {
    timestamps: false,
    tableName: "User",
  }
);


module.exports = User;

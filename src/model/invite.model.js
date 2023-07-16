const { DataTypes } = require("sequelize");

const seq = require("../database/seq.mysql");
const User = require("./user.model");

const Invite = seq.define(
  "Invite",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      comment: "邀请码ID",
    },
    role: {
      type: DataTypes.ENUM("member", "premium", "teacher", "admin"),
      allowNull: false,
      comment: "身份",
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "邀请码内容",
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: "是否可使用",
    },
    u_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "使用用户ID",
      references: {
        model: User,
        key: "id",
      },
    },
    used_time: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "使用时间",
    },
  },
  {
    timestamps: false,
    tableName: "Invite",
  }
);

Invite.belongsTo(User, { foreignKey: "u_id" });

module.exports = Invite;

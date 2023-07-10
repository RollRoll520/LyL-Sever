const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/config.default");
const {
  tokenExpiredError,
  invalidToken,
  hasNotAdminPermission,
} = require("../const/err.type");
const { getUserInfo } = require("../service/user.service");

const auth = async (ctx, next) => {
  const token = ctx.request.header["token"];
  try {
    //user中包含了payload的id、user_name信息
    const user = jwt.verify(token, JWT_SECRET);

    console.log(user);
    ctx.state.user = user;
    await next();
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        console.error("token已过期", err);
        return ctx.app.emit("error", tokenExpiredError, ctx);
      case "JsonWebTokenError":
        console.error("无效的token", err);
        return ctx.app.emit("error", invalidToken, ctx);
    }
  }
};

//用于浏览器免token测试接口
const testEntry = async (ctx, next) => {
  ctx.state.user = { id: 2, username: "test" };
  await next();
};

//管理员权限
const hadAdminPermission = async (ctx, next) => {
  const { id } = ctx.state.user;
  const res = await getUserInfo(id);
  if (res.role != "admin") {
    const error = ctx.state.user.name + "没有操作权限!";
    console.log(error);
    hasNotAdminPermission.result = error;
    return ctx.app.emit("error", hasNotAdminPermission, ctx);
  }

  await next();
};

module.exports = {
  auth,
  testEntry,
  hadAdminPermission,
};

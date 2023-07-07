const bcrypt = require("bcryptjs");
const { getUserInfo } = require("../service/user.service");
const {
  userFormatError,
  userAlreadyExist,
  userRegisterError,
  userLoginError,
  invalidPassword,
  oldPasswordError,
  userDoesNotExist,
  passwordUpdateError,
} = require("../const/err.type");

const userRegisterValidator = async (ctx, next) => {
  const { username, password, email } = ctx.request.body;
  if (!username || !password || !email) {
    console.error("用户信息不完整", ctx.request.body);
    ctx.app.emit("error", userFormatError, ctx);
    return;
  }
  await next();
};

const userLoginValidator = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  if (!username || !password) {
    console.error("登录信息不完整", ctx.request.body);
    ctx.app.emit("error", userFormatError, ctx);
    return;
  }
  await next();
};

const confirmUser = async (ctx, next) => {
  const { username } = ctx.request.body;
  try {
    const res = await getUserInfo({ username });
    if (res) {
      console.error("用户已存在", username);
      ctx.app.emit("error", userAlreadyExist, ctx);
      return;
    }
  } catch (err) {
    console.error("获取用户信息错误");
    ctx.app.emit("error", userRegisterError, ctx);
    return;
  }
  await next();
};

const crpyPassword = async (ctx, next) => {
  const { password } = ctx.request.body;
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  ctx.request.body.password = hash;
  await next();
};

const confirmOldPassword = async (ctx, next) => {
  const { id } = ctx.state.user;
  const { oldPassword } = ctx.request.body;
  try {
    const res = await getUserInfo({ id });
    if (!bcrypt.compareSync(oldPassword, res.password)) {
      console.log(oldPassword, res.password);
      ctx.app.emit("error", oldPasswordError, ctx);
      return;
    }
  } catch (err) {
    console.error(err);
    ctx.app.emit("error", passwordUpdateError, ctx);
  }
  await next();
};

const confirmUserLogin = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  try {
    const res = await getUserInfo({ username });
    // 1. 判断用户名是否存在，不存在报错
    if (!res) {
      console.error("用户名不存在", { username });
      ctx.app.emit("error", userDoesNotExist, ctx);
      return;
    }
    // 2. 判断密码是否正确，否则报错
    if (!bcrypt.compareSync(password, res.password)) {
      console.log(password, res.password);
      ctx.app.emit("error", invalidPassword, ctx);
      return;
    }
  } catch (err) {
    console.error(err);
    return ctx.app.emit("error", userLoginError, ctx);
  }
  await next();
};

module.exports = {
  userRegisterValidator,
  userLoginValidator,
  confirmUser,
  crpyPassword,
  confirmUserLogin,
  confirmOldPassword,
};

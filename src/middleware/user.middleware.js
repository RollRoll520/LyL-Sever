const bcrypt = require("bcryptjs");
const {
  getUserInfo,
  getUserInfoByUsername,
} = require("../service/user.service");
const {
  userFormatError,
  userAlreadyExist,
  userRegisterError,
  userLoginError,
  invalidPasswordError,
  oldPasswordError,
  userDoesNotExist,
  passwordUpdateError,
  userInviteError,
} = require("../const/err.type");
const { getInviteInfo } = require("../service/invite.service");

const userRegisterValidator = async (ctx, next) => {
  const { username, password, email, invite } = ctx.request.body;
  if (!username || !password || !email || !invite) {
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
    const res = await getUserInfoByUsername(username);
    if (res) {
      console.error("用户已存在", username);
      return ctx.app.emit("error", userAlreadyExist, ctx);
    }
  } catch (err) {
    console.error("获取用户信息错误");
    userRegisterError.result = err;
    ctx.app.emit("error", userRegisterError, ctx);
    return;
  }
  await next();
};

const confirmInvitation = async (ctx, next) => {
  const { invite } = ctx.request.body;
  try {
    const res = await getInviteInfo(invite);
    if (res && res.available) {
      ctx.state.role = res.role;
      await next();
    } else {
      const error = "邀请码不存在或已使用！";
      throw error;
    }
  } catch (err) {
    console.log(err);
    userInviteError.result = err;
    ctx.app.emit("error", userInviteError, ctx);
  }
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
    const res = await getUserInfo(id);
    if (!bcrypt.compareSync(oldPassword, res.password)) {
      console.log(oldPassword, res.password);
      ctx.app.emit("error", oldPasswordError, ctx);
      return;
    }
    await next();
  } catch (err) {
    console.error(err);
    ctx.app.emit("error", passwordUpdateError, ctx);
  }
};

const confirmUserLogin = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  try {
    const res = await getUserInfoByUsername(username);
    // 1. 判断用户名是否存在，不存在报错
    if (!res) {
      console.error("用户名不存在", { username });
      ctx.app.emit("error", userDoesNotExist, ctx);
      return;
    }
    // 2. 判断密码是否正确，否则报错
    if (!bcrypt.compareSync(password, res.password)) {
      console.log(password, res.password);
      ctx.app.emit("error", invalidPasswordError, ctx);
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
  confirmInvitation,
  crpyPassword,
  confirmUserLogin,
  confirmOldPassword,
};

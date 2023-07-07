const {
  createUser,
  getUserInfo,
  updateUser,
  updatePassword,
} = require("../service/user.service");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  userRegisterError,
  userDoesNotExist,
  invalidPassword,
  userLoginError,
  userUpdateError,
  passwordUpdateError,
} = require("../const/err.type");
const { JWT_SECRET } = require("../config/config.default");

class UserController {
  async register(ctx, next) {
    // 1. 获取数据
    const { username, password, email } = ctx.request.body;

    // 2. 操作数据库
    try {
      const res = await createUser(username, password, email);
      console.log(res);

      // 3. 返回结果
      ctx.body = {
        code: 0,
        message: "注册成功",
        result: {
          id: res.id,
          username: res.username,
        },
      };
    } catch (err) {
      console.error(err);
      ctx.app.emit("error", userRegisterError, ctx);
    }
  }

  async login(ctx, next) {
    const { username, password } = ctx.request.body;

    // 1. 获取用户信息，在token的payload中记录id、user_name
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
      const payload = { id: res.id, username };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
      console.log(token);
      ctx.body = {
        code: 0,
        message: "登录成功",
        result: {
          token: jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" }),
        },
      };
    } catch (err) {
      console.error(err);
      ctx.app.emit("error", userLoginError, ctx);
    }
  }

  async update(ctx, next) {
    const { id } = ctx.state.user;
    const { username, email } = ctx.request.body;

    try {
      const res = await updateUser(id, username, email);
      console.log(res);

      ctx.body = {
        code: 0,
        message: "修改成功",
        result: {
          id: res.id,
          username: res.username,
          email: res.email,
        },
      };
    } catch (err) {
      console.error(err);
      ctx.app.emit("error", userUpdateError, ctx);
    }
  }

  async updatePsw(ctx, next) {
    const { id } = ctx.state.user;
    const { oldPassword, password } = ctx.request.body;

    try {
      const res = await updatePassword(id, password);
      console.log(res);

      ctx.body = {
        code: 0,
        message: "密码修改成功",
      };
    } catch (err) {
      console.error(err);
      ctx.app.emit("error", passwordUpdateError, ctx);
    }
  }
}

module.exports = new UserController();

const Router = require("koa-router");
const {
  register,
  login,
  update,
  updatePsw,
} = require("../controller/user.controller");
const { auth } = require("../middleware/auth.middleware");
const {
  userRegisterValidator,
  userLoginValidator,
  confirmUser,
  crpyPassword,
  confirmUserLogin,
  confirmOldPassword,
  confirmInvitation,
} = require("../middleware/user.middleware");

const router = new Router({ prefix: "/user" });

// 注册接口
router.post(
  "/register",
  userRegisterValidator,
  confirmUser,
  confirmInvitation,
  crpyPassword,
  register
);

// 登录接口
router.post("/login", userLoginValidator, confirmUserLogin, login);

// 修改用户信息(只有邮箱)接口
router.patch("/update_info", auth, update);

//修改密码接口
router.patch("/update_password", auth, confirmOldPassword, crpyPassword, updatePsw);

module.exports = router;

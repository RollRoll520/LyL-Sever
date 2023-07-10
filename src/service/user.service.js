const User = require("../model/user.model");

class UserService {
  // 创建用户
  async createUser(username, password, email, role) {
    const res = await User.create({ username, password, email, role });
    return res.dataValues;
  }

  // 查询用户
  async getUserInfo({ id, username, password, email }) {
    console.log("getUserInfo called with:", {
      id,
      username,
      password,
      email,
    });
    const whereOpt = {};
    id && Object.assign(whereOpt, { id });
    username && Object.assign(whereOpt, { username });
    password && Object.assign(whereOpt, { password });
    email && Object.assign(whereOpt, { email });

    const res = await User.findOne({
      attributes: ["id", "username", "password", "email", "register_time"],
      where: whereOpt,
    });
    return res ? res.dataValues : null;
  }

  // 修改用户信息
  async updateUser(id, email) {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User ${id} not found`);
    }
    const updatedUser = await user.update({ email });
    return updatedUser.dataValues;
  }

  //修改密码
  async updatePassword(id, password) {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      throw new Error(`User ${id} not found`);
    }
    const updatedUser = await user.update({ password: password });
    return updatedUser.dataValues;
  }

  async getUserInfo(id) {
    const user = await User.findOne({ where: { id } });
    return user.dataValues;
  }
}

module.exports = new UserService();

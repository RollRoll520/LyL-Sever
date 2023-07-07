const axios = require("axios");

// 注册接口测试
async function testRegister() {
  const data = {
    username: "testuser",
    password: "testpassword",
    email: "testuser@example.com",
  };
  const res = await axios.post("http://localhost:8001/user/register", data);
  console.log(res.data);
}

// 登录接口测试
async function testLogin() {
  const data = {
    username: "testuser",
    password: "testpassword",
  };
  const res = await axios.post("http://localhost:8001/user/login", data);
  console.log(res.data);
}

// 修改用户信息接口测试
async function testUpdate() {
  const data = {
    username: "newtestuser",
    password: "newtestpassword",
    email: "newtestuser@example.com",
  };
  const token = "YOUR_AUTH_TOKEN_HERE"; // 从登录接口获取的token
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const res = await axios.patch("http://localhost:8001/user", data, {
    headers,
  });
  console.log(res.data);
}

// 执行测试
testRegister();
testLogin();
testUpdate();

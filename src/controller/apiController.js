import LoginRegisterService from "../service/LoginRegisterService.js";
import loginRegisterService from "../service/LoginRegisterService.js";
const testApi = (req, res) => {
  return res.status(200).json({
    data: "oke",
    name: "yu",
  });
};
const handleRegister = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password || !req.body.phone) {
      return res.status(200).json({
        EM: "Missing required parameters",
        EC: 1,
        DT: "",
      });
    }
    if (req.body.phone.length < 8) {
      return res.status(200).json({
        EM: "Your password must have more than 8 letters",
        EC: 1,
        DT: "",
      });
    }
    let data = await loginRegisterService.Register(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: "",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error from sever",
      EC: "-1",
      DT: "",
    });
  }
};
const handleLogin = async (req, res) => {
  try {
    let data = await loginRegisterService.Login(req.body);
    if (data && data.EC === 0) {
      res.cookie("token", data.DT.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/", // 👈 thêm
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error from sever",
      EC: "-1",
      DT: "",
    });
  }
};
const handleLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/", // 👈 phải giống
    });
    res.json({ message: "Logged out" });
  } catch (error) {
    console.log(error);
  }
};
const handleLoginGoogle = async (req, res) => {
  try {
    let { token } = req.body;
    console.log("checktoken gg ", token);
    let data = await LoginRegisterService.googleLogin(token);
    if (data && data.EC === 0) {
      res.cookie("token", data.DT.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/", // 👈 thêm
        maxAge: 24 * 60 * 60 * 100,
      });
    }
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Error from sever",
      EC: "-1",
      DT: "",
    });
  }
};

export default {
  testApi,
  handleRegister,
  handleLogin,
  handleLogout,
  handleLoginGoogle,
};

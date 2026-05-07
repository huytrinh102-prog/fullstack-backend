import db from "../models/index.cjs";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import axios from "axios";
import { checkToken } from "../middleware/jwt-action.js";

const Register = async (rawData, req, res) => {
  //check emai/phone password
  try {
    const { email, phone, password, username } = rawData;
    const isExistEmail = await db.User.findOne({ where: { email: email } });
    const isExistPhone = await db.User.findOne({ where: { phone: phone } });
    if (isExistEmail) {
      return {
        EM: "the email already exists",
        EC: 1,
      };
    }
    if (isExistPhone) {
      return {
        EM: "the phone number already exists",
        EC: 1,
      };
    }

    // hash password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    console.log("check passs", hashPassword);
    // create new user
    const newUser = await db.User.create({
      email: email,
      password: hashPassword,
      username: username,
      phone: phone,
      groupId: 4,
    });
    return { EM: "register success", EC: 0 };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrong from server...",
      EC: 1,
    };
  }
};
const Login = async (data) => {
  try {
    const user = await db.User.findOne({
      where: {
        [Op.or]: [{ email: data.input }, { phone: data.input }],
      },
    });

    if (!user) {
      return {
        EM: "THE ACCOUNT IS NOT EXIST",
        EC: 1,
        DT: "",
      };
    }

    const checkPassword = await bcrypt.compare(data.password, user.password);

    if (!checkPassword) {
      return {
        EM: "WRONG PASSWORD",
        EC: 1,
        DT: "",
      };
    }

    const userWithRole = await db.User.findOne({
      where: { id: user.id },
      attributes: ["id", "email", "username"],
      include: {
        model: db.Group,
        attributes: ["id", "name", "description"],
        include: {
          model: db.Role,
          attributes: ["id", "url", "description"],
        },
      },
    });
    const isAdmin = userWithRole?.Group?.name === "admin";
    const userData = {
      email: userWithRole?.email || "",
      username: userWithRole?.username || "",
      groupname: userWithRole?.Group?.name || "",
    };
    const Roles = userWithRole?.Group?.Roles?.map((r) => r) || [];
    const payload = {
      email: userWithRole.email,
      id: userWithRole.id,
      username: userWithRole.username,
      roles: Roles,
      isAdmin: isAdmin,
    };
    let access_token = "";
    try {
      access_token = jwt.sign(payload, process.env.jwtKey, {
        expiresIn: "1d",
      });
    } catch (error) {
      console.log(error);
    }

    return {
      EM: "Login success",
      EC: 0,
      DT: { access_token: access_token, user: userData },
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Error from server...",
      EC: 1,
      DT: "",
    };
  }
};
const googleLogin = async (token) => {
  try {
    const res = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`,
    );

    const { email, name, picture } = res.data;
    let user = await db.User.findOne({ where: { email } });

    if (!user) {
      user = await db.User.create({
        email,
        username: name,
        groupId: 4,
      });
    }
    const userWithRole = await db.User.findOne({
      where: { id: user.id },
      attributes: ["id", "email", "username"],
      include: {
        model: db.Group,
        attributes: ["id", "name", "description"],
        include: {
          model: db.Role,
          attributes: ["id", "url", "description"],
        },
      },
    });
    const isAdmin = userWithRole?.Group?.name === "admin";
    const userData = {
      email: userWithRole?.email || "",
      username: userWithRole?.username || "",
      groupname: userWithRole?.Group?.name || "",
    };
    const Roles = userWithRole?.Group?.Roles?.map((r) => r) || [];
    const payload = {
      email: userWithRole.email,
      id: userWithRole.id,
      username: userWithRole.username,
      roles: Roles,
      isAdmin: isAdmin,
    };
    const access_token = jwt.sign(payload, process.env.jwtKey, {
      expiresIn: "1d",
    });
    return {
      EC: 0,
      EM: "Login success",
      DT: { access_token: access_token, user: userData },
    };
  } catch (error) {
    console.log(error);
    return {
      EC: 1,
      EM: "Google login failed",
    };
  }
};
export default { Register, Login, googleLogin };

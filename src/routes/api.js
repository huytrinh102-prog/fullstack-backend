import express from "express";
import apiController from "../controller/apiController.js";
import userController from "../controller/userController.js";
import { checkPermission, checkToken } from "../middleware/jwt-action.js";
import rolesController from "../controller/rolesController.js";
import GroupRoleController from "../controller/GroupRoleController.js";
import cloudinary from "../config/cloudinary.js";
const router = express.Router();
/**
 * @param {*} app :express appß
 */
const initApiRoutes = (app) => {
  // login logout
  router.post("/register", apiController.handleRegister);
  router.post("/login", apiController.handleLogin);
  router.post("/logout", apiController.handleLogout);
  router.post("/auth/google", apiController.handleLoginGoogle);
  // account to get token
  router.get("/account", checkToken, userController.getAccountData);
  // /token
  router.use(checkToken, checkPermission);

  // cloudinary
  router.post("/cloudinary/sign-avatar", userController.userAvatar);

  // roles
  router.post("/role-create", rolesController.createRoles);
  router.get("/role-read", rolesController.getRoles);
  router.delete("/role-delete/:id", rolesController.deleteRole);
  router.put("/role-update/:id", rolesController.updateRole);

  // crud
  router.get("/read", userController.getUsers);
  router.post("/create", userController.creatUser);
  router.delete("/delete/:id", userController.deleteUser);
  router.put("/update/:id", userController.updateUser);
  // group-role
  router.get("/group", userController.getGroups);
  router.get("/group-role/read", GroupRoleController.getAllRoles);
  router.get("/role-by-group/:id", GroupRoleController.getRolesByGroup);
  router.post("/group-role/update", GroupRoleController.updateRolesbyGroup);
  return app.use("/api/v1/", router);
};
export default initApiRoutes;

import express from "express";
import apiController from "../controller/apiController.js";
import userController from "../controller/userController.js";
import { checkPermission, checkToken } from "../middleware/jwt-action.js";
import rolesController from "../controller/rolesController.js";
import GroupRoleController from "../controller/GroupRoleController.js";
const router = express.Router();
/**
 * @param {*} app :express appß
 */
const initApiRoutes = (app) => {
  // puclic
  router.post("/login", apiController.handleLogin);
  router.post("/register", apiController.handleRegister);
  router.post("/auth/google", apiController.handleLoginGoogle);
  router.post("/refresh-token", apiController.handleRefreshToken);
  router.post("/logout", apiController.handleLogout);
  // CHECK TOKEN
  router.use(checkToken);
  router.get("/account", userController.getAccountData);
  router.post("/cloudinary/sign-avatar", userController.userAvatar);
  // PERMISSION
  router.use(checkPermission);
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

import express from "express";
import apiController from "../controller/apiController.js";
import userController from "../controller/userController.js";
import { checkPermission, checkToken } from "../middleware/jwt-action.js";
import rolesController from "../controller/rolesController.js";
import GroupRoleController from "../controller/GroupRoleController.js";
import projectController from "../controller/ProjectController.js";
import todoController from "../controller/todoController.js";
import projectMembersController from "../controller/projectMembersController.js";
import dashboardController from "../controller/dashboardController.js";
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
  // project
  router.post("/project", projectController.createProject);
  router.get("/project", projectController.getProject);
  router.get("/project/:id", projectController.getProjectbyId);
  router.delete("/project/:id", projectController.deleteProject);
  router.put("/project/:id", projectController.updateProject);
  // dashboard
  router.get("/dashboard", dashboardController.getDashboard);
  // project member
  router.post(
    "/project/:projectId/members",
    projectMembersController.addMembers,
  );
  router.get(
    "/project/:projectId/members",
    projectMembersController.getMembers,
  );
  router.delete(
    "/project/:projectId/members/:userId",
    projectMembersController.deleteMembers,
  );

  // todos
  router.post("/todos", todoController.createTodos);
  router.get("/todos/user/:id", todoController.getTodosbyuserId);
  router.get("/todos/project/:projectId", todoController.getTodos);
  router.delete("/todos/:id", todoController.deleteTodo);
  router.put("/todos/:id", todoController.updateTodo);
  // roles
  router.post("/role-create", rolesController.createRoles);
  router.get("/role-read", rolesController.getRoles);
  router.delete("/role-delete/:id", rolesController.deleteRole);
  router.put("/role-update/:id", rolesController.updateRole);

  // crud user
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

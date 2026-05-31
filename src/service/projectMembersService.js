import db from "../models/index.cjs";
import { Op, Sequelize } from "sequelize";
const read = async (projectId) => {
  try {
    const data = await db.User.findAll({
      include: {
        model: db.Project,
        as: "projects",
        where: { id: projectId },
        attributes: [],
        through: { attributes: [] },
      },
    });
    if (!data) {
      return { EM: "Miss something...", EC: 0, DT: data };
    }
    return {
      EM: "Get the members success",
      EC: 0,
      DT: data,
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

const create = async (projectId, userId) => {
  if (!projectId || !userId) {
    return {
      EM: "Missing projectId or  userId",
      EC: 1,
      DT: "",
    };
  }
  try {
    const existed = await db.ProjectUser.findOne({
      where: { userId, projectId },
    });

    if (existed) {
      return {
        EM: "User already in project",
        EC: 1,
        DT: "",
      };
    }

    const res = await db.ProjectUser.create({
      userId,
      projectId,
    });
    if (!res) {
      return {
        EM: "Error from server...",
        EC: 1,
        DT: "",
      };
    }
    return {
      EM: "Add the member success",
      EC: 0,
      DT: "",
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
const remove = async (projectId, userId) => {
  try {
    if (!projectId || !userId) {
      return { EM: "Missing projectID or userID", EC: 1, DT: "" };
    }
    const member = await db.ProjectUser.findOne({
      where: { projectId, userId },
    });
    if (!member) {
      return {
        EM: "Member not found",
        EC: 1,
        DT: "",
      };
    }
    await db.ProjectUser.destroy({
      where: { projectId, userId },
    });
    return {
      EM: "Delete the member success",
      EC: 0,
      DT: null,
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
export default { read, remove, create };

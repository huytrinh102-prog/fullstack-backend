import db from "../models/index.cjs";
import cloudinary from "../config/cloudinary.js";
import { Op, Sequelize } from "sequelize";

const create = async (data) => {
  if (
    !data ||
    !data?.username ||
    !data.name ||
    !data.startDate ||
    !data.endDate
  ) {
    return {
      EM: "Missing required parameters",
      EC: 1,
      DT: "",
    };
  }
  if (isNaN(Date.parse(data.startDate)) || isNaN(Date.parse(data.endDate))) {
    return {
      EM: "Invalid DATE",
      EC: 1,
      DT: "",
    };
  }
  const {
    name,
    description,
    startDate,
    endDate,
    avatarUrl,
    avatarPublicId,
    username,
  } = data;
  const DEFAULT_AVATAR =
    "https://media.licdn.com/dms/image/v2/C4E12AQEDHtUmDLS3yQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520046874939?e=2147483647&v=beta&t=9r5LerPDALfUQW36HYezN-aRfmXdJsWrtjJ-j-VDZAs";
  try {
    const res = await db.Project.create({
      name: name || "NONAME",
      description: description || "",
      startDate: startDate,
      endDate: endDate,
      avatarUrl: avatarUrl || DEFAULT_AVATAR,
      avatarPublicId: avatarPublicId || "",
      status: "PENDING",
      createdBy: username,
    });
    if (!res) {
      return {
        EM: "Error from server...",
        EC: 1,
        DT: "",
      };
    }
    return {
      EM: "Create the project success",
      EC: 0,
      DT: res,
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
const read = async (search, sort) => {
  // /condition
  let whereCondition = {};
  if (search) {
    const keyword = search.trim().split(" ").filter(Boolean);
    whereCondition = {
      [Op.and]: keyword.map((word) => ({
        [Op.or]: [
          { name: { [Op.like]: `%${word}%` } },
          { description: { [Op.like]: `%${word}%` } },
        ],
      })),
    };
  }
  // order
  let order = [["id", "DESC"]];
  if (sort) {
    const [field, direction] = sort.split(",");
    order = [[field, direction.toUpperCase()]];
  }
  let data = await db.Project.findAll({
    where: whereCondition,
    attributes: [
      "id",
      "name",
      "description",
      "startDate",
      "endDate",
      "avatarUrl",
      "avatarPublicId",
      [Sequelize.fn("COUNT", Sequelize.col("users.id")), "memberCount"],
    ],
    include: [
      {
        model: db.User,
        as: "users",
        attributes: ["username", "email"],
      },
    ],
    group: ["Project.id"],
    order: order,
  });

  try {
    return {
      EM: "Get the project success",
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
const readProjectByuserId = async (userId) => {
  if (!userId) {
    return { EM: "Missung userId", EC: 1, DT: "" };
  }
  try {
    const user = await db.User.findOne({
      where: { id: userId },
      include: {
        model: db.Project,
        as: "projects",
        attributes: [
          "id",
          "name",
          "description",
          "startDate",
          "endDate",
          "avatarUrl",
        ],
      },
    });
    if (!user) {
      return {
        EM: "User not found",
        EC: 1,
        DT: "",
      };
    }
    return {
      EM: "Get the projects success",
      EC: 0,
      DT: user,
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
const remove = async (projectId) => {
  try {
    if (!projectId) {
      return { EM: "Project not found", EC: 1, DT: "" };
    }
    const project = await db.Project.findOne({
      where: { id: projectId },
    });
    if (!project) {
      return {
        EM: "Project not found",
        EC: 1,
        DT: "",
      };
    }
    if (project.avatarPublicId) {
      await cloudinary.uploader.destroy(project.avatarPublicId);
    }
    await db.Project.destroy({
      where: { id: projectId },
    });
    return {
      EM: "Delete project success",
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
const update = async (data, projectId) => {
  const { name, description, startDate, endDate, status } = data;
  try {
    const project = await db.Project.findOne({ where: { id: projectId } });
    if (!project) {
      return { EM: "Projetc not found", EC: 1, DT: "" };
    }
    const oldPublicId = project.avatarPublicId;
    if (
      oldPublicId &&
      data.avatarPublicId &&
      data.avatarPublicId !== oldPublicId
    ) {
      await cloudinary.uploader.destroy(oldPublicId);
    }
    const updateData = {
      name,
      description,
      startDate,
      endDate,
      status,
    };
    if (data.avatarPublicId) {
      updateData.avatarPublicId = data.avatarPublicId;
    }
    if (data.avatarUrl) {
      updateData.avatarUrl = data.avatarUrl;
    }
    await db.Project.update(updateData, {
      where: {
        id: projectId,
      },
    });
    return {
      EM: "Update the project success",
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
export default { create, remove, update, read, readProjectByuserId };

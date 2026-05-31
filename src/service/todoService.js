import db from "../models/index.cjs";
import { Op, Sequelize } from "sequelize";
const read = async (search, filter, priority, projectId, userId) => {
  try {
    let whereCondition = {};

    whereCondition.projectId = projectId;

    // SEARCH
    if (search) {
      const keyword = search.trim().split(" ").filter(Boolean);

      whereCondition[Op.and] = keyword.map((word) => ({
        [Op.or]: [
          { title: { [Op.like]: `%${word}%` } },
          { description: { [Op.like]: `%${word}%` } },
        ],
      }));
    }

    // FILTER STATUS
    if (filter) {
      const f = filter.toUpperCase();

      if (f === "COMPLETED") {
        whereCondition.status = "COMPLETED";
      }

      if (f === "PENDING") {
        whereCondition.status = "PENDING";
      }

      if (f === "MINE") {
        whereCondition.userId = userId;
      }
    }

    // PRIORITY
    if (priority) {
      const p = priority.toUpperCase();

      if (p === "HIGH") {
        whereCondition.priority = 3;
      }

      if (p === "MEDIUM") {
        whereCondition.priority = 2;
      }

      if (p === "LOW") {
        whereCondition.priority = 1;
      }
    }

    const data = await db.Todo.findAll({
      where: whereCondition,

      attributes: [
        "id",
        "title",
        "description",
        "dueDate",
        "status",
        "priority",
        "userId",
        "projectId",
      ],
    });

    return {
      EM: "Get the todo list success",
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

const create = async (data) => {
  if (!data || !data.title || !data.priority || !data.projectId) {
    return {
      EM: "Missing required parameters",
      EC: 1,
      DT: "",
    };
  }

  const { title, description, priority, projectId } = data; // status
  try {
    const res = await db.Todo.create({
      title: title || "NONAME",
      description: description || "",
      priority: priority,
      projectId: projectId,
    });
    if (!res) {
      return {
        EM: "Error from server...",
        EC: 1,
        DT: "",
      };
    }
    return {
      EM: "Add the todo success",
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
const update = async (data) => {
  const { id, title, description, priority, status } = data;
  try {
    const todo = await db.Todo.findOne({ where: { id: id } });
    if (!todo) {
      return { EM: "Todo not found", EC: 1, DT: "" };
    }
    const updateData = {
      title,
      description,
      priority,
      status,
    };
    await db.Todo.update(updateData, {
      where: {
        id: id,
      },
    });
    return {
      EM: "Update the todo success",
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
const remove = async (todoId) => {
  try {
    if (!todoId) {
      return { EM: "Todo not found", EC: 1, DT: "" };
    }
    const todo = await db.Todo.findOne({
      where: { id: todoId },
    });
    if (!todo) {
      return {
        EM: "Todo not found",
        EC: 1,
        DT: "",
      };
    }
    await db.Todo.destroy({
      where: { id: todoId },
    });
    return {
      EM: "Delete the Todo success",
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

const readTodosbyuserId = async (userId) => {
  try {
    if (!userId) {
      return { EM: "Todo not found", EC: 1, DT: "" };
    }
    let data = await db.Todo.findAll({ where: { userId: userId } });
    if (!data) {
      return { EM: "Todo not found", EC: 1, DT: "" };
    }
    return { EM: "Get the todo list success", EC: 0, DT: data };
  } catch (error) {}
};
export default { read, create, update, remove, readTodosbyuserId };

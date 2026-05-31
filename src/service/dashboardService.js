import db from "../models/index.cjs";
const read = async (userId) => {
  try {
    const projects = await db.Project.findAll({
      include: [
        {
          model: db.User,
          as: "users",
          where: {
            id: userId,
          },
          through: {
            attributes: [],
          },
        },
      ],
      limit: 5,
      order: [["createdAt", "DESC"]],
    });
    const todos = await db.Todo.findAll({
      where: { userId },
      limit: 5,
      order: [["createdAt", "DESC"]],
    });
    const totalProject = await db.Project.count({
      include: [
        {
          model: db.User,
          as: "users",
          where: {
            id: userId,
          },

          through: {
            attributes: [],
          },
        },
      ],
    });

    const totalTodo = await db.Todo.count({
      where: {
        userId: userId,
      },
    });

    const completedTodo = await db.Todo.count({
      where: {
        userId: userId,
        status: "Completed",
      },
    });
    const pendingTodo = totalTodo - completedTodo;
    return {
      EC: 0,
      EM: "OK",
      DT: {
        stats: {
          totalProject,
          totalTodo,
          completedTodo,
          pendingTodo,
        },
        recentProjects: projects,
        recentTodos: todos,
      },
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
export default { read };

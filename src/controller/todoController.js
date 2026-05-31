import todoService from "../service/todoService.js";
const createTodos = async (req, res) => {
  try {
    let data = await todoService.create(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};
const getTodos = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const { projectId } = req.params;
    const { search, filter, priority } = req.query;
    let data = await todoService.read(
      search,
      filter,
      priority,
      projectId,
      userId,
    );
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};
const getTodosbyuserId = async (req, res) => {
  try {
    const id = req?.user?.id;
    let data = await todoService.readTodosbyuserId(id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};
const deleteTodo = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    let data = await todoService.remove(id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateTodo = async (req, res) => {
  try {
    let data = await todoService.update(req?.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};
export default {
  createTodos,
  getTodos,
  getTodosbyuserId,
  deleteTodo,
  updateTodo,
};

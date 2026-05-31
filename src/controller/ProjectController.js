import projectService from "../service/projectService.js";
import { Op, Sequelize } from "sequelize";
const createProject = async (req, res) => {
  try {
    const id = req?.user?.id;
    let data = await projectService.create(req?.body, id);
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

const getProject = async (req, res) => {
  try {
    const { search, filter } = req.query;
    const id = req.user?.id;
    let data = await projectService.read(search, filter, id);
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

const getProjectbyId = async (req, res) => {
  try {
    const projectId = req?.params.id;
    let data = await projectService.readProjectById(projectId);
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
const deleteProject = async (req, res) => {
  try {
    const id = req.params.id;
    let data = await projectService.remove(id);
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
const updateProject = async (req, res) => {
  try {
    const id = req.params.id;
    let data = await projectService.update(req.body, id);
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
  createProject,
  getProject,
  deleteProject,
  updateProject,
  getProjectbyId,
};

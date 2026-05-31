import projectMembersService from "../service/projectMembersService.js";
const addMembers = async (req, res) => {
  try {
    let { projectId } = req?.params;
    let { userId } = req.body;
    let data = await projectMembersService.create(projectId, userId);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};
const getMembers = async (req, res) => {
  try {
    const { projectId } = req.params;
    let data = await projectMembersService.read(projectId);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteMembers = async (req, res) => {
  try {
    let { projectId, userId } = req.params;
    console.log(projectId, userId);
    let data = await projectMembersService.remove(projectId, userId);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};
export default { addMembers, getMembers, deleteMembers };

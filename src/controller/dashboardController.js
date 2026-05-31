import dashboardService from "../service/dashboardService.js";
const getDashboard = async (req, res) => {
  try {
    const userId = req?.user?.id;
    let data = await dashboardService.read(userId);
    return res.status(200).json({ EC: data.EC, EM: data.EM, DT: data.DT });
  } catch (error) {
    console.log(error);
  }
};

export default { getDashboard };

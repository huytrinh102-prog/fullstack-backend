import jwt from "jsonwebtoken";

const checkToken = (req, res, next) => {
  try {
    let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json("No token");
    }
    const decoded = jwt.verify(token, process.env.jwtKey);
    req.user = decoded;
    // console.log("check user", req.user);
    next();
  } catch (error) {
    return res.status(401).json("Invalid token");
  }
};

const checkPermission = (req, res, next) => {
  const roles = req.user?.roles;
  const currentUrl = req.path;
  const isAdmin = req?.user?.isAdmin;
  if (isAdmin) {
    return next();
  }
  if (!roles || roles.length === 0) {
    return res.status(403).json("No permission");
  }
  const hasPermission = roles.some((item) => item.url.includes(currentUrl));

  if (!hasPermission) {
    return res.status(403).json("No permission");
  }
  next();
};

export { checkToken, checkPermission };

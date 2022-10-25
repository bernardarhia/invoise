import Users from "../models/User.js";
import HttpException from "../utils/exceptions/httpException.js";

const isAdminMiddleware = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await Users.findByPk(id);

    if(!user)return next(HttpException(401, "Unauthorized user"));
    if (user.role !== "admin" )
      return next(new HttpException(401, "Unauthorized user"));
    next();
  } catch (error) {
    return next(new HttpException(402, error.message));
  }
};
export default isAdminMiddleware;

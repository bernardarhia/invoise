import { verifyToken } from "../utils/token.js";
import httpException from "../utils/exceptions/httpException.js";
import Token from "../models/Token.js";
import Users from "../models/User.js";

const authenticatedMiddleware = async (req, res, next) => {
  const bearer = req.headers.authorization;
  if (!bearer) return next(new httpException(401, "Unauthorized"));

  const accessToken = bearer.split("Bearer ")[1].trim();

  try {
    const payload = await verifyToken(accessToken);
    if (!payload) return next(new httpException(401, "Unauthorized"));

    const token = await Token.findOne({
      where: { UserId: payload.id },
    });
    const user = await Users.findByPk(payload.id);

    if (!token || !user) return next(new httpException(401, "Unauthorized"));

    const { firstName, lastName, email, id } = user;
    req.user = { firstName, lastName, email, id };

    next();
  } catch (error) {
    return next(new httpException(401, "Unauthorized"));
  }
};

export default authenticatedMiddleware;

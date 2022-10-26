import { verifyRefreshToken, verifyToken } from "../utils/token.js";
import httpException from "../utils/exceptions/httpException.js";
import Token from "../models/Token.js";
import Users from "../models/User.js";

const authenticatedMiddleware = async (req, res, next) => {
  try {
    const bearer = req.headers.authorization;
    if (!bearer) return next(new httpException(401, "Unauthorized"));

    const accessToken = bearer.split("Bearer ")[1].trim();
    if (!accessToken || accessToken == undefined)
      return next(new httpException(401, "Unauthorized"));

    const payload = await verifyToken(accessToken);
    if (!payload) return next(new httpException(401, "Unauthorized"));

    const user = await Users.findByPk(payload.id);
    const token = await Token.findOne({ where: { UserId: payload.id } });
    if (!token || !user || !token.authToken)
      return next(new httpException(401, "Unauthorized"));

    const refreshPayload = await verifyRefreshToken(token.authToken);

    if (!refreshPayload) return next(new httpException(401, "Unauthorized"));

    const { firstName, lastName, email, id, role } = user;
    req.user = { firstName, lastName, email, id, role };

    next();
  } catch (error) {
    return next(new httpException(401, "Unauthorized"));
  }
};

export default authenticatedMiddleware;

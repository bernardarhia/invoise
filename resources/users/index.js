import { Router } from "express";
import jwt from "jsonwebtoken";
import authenticatedMiddleware from "../../middleware/authenticatedMiddleware.js";
import Token from "../../models/Token.js";
import Users from "../../models/User.js";
import httpException from "../../utils/exceptions/httpException.js";
import extractObjectData from "../../utils/extractObjectData.js";
import UserService from "./service.js";
import {
  loginAuthenticationSchema,
  updateAuthenticationSchema,
  userValidationMiddleware,
  authenticationSchema,
  updatePasswordAuthenticationSchema,
} from "./validation.js";

class UserResource {
  constructor() {
    this.subRoute = "users";
    this.routes = {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/logout",
      UPDATE: "/auth/update",
      CHANGE_PASSWORD: "/auth/password/change",
      ME: "/me",
      CREATE: "/create",
    };
    this.router = new Router();
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    const { LOGIN, REGISTER, LOGOUT, ME, UPDATE, CHANGE_PASSWORD } =
      this.routes;

    this.router.post(
      REGISTER,
      userValidationMiddleware(authenticationSchema),
      this.register
    );
    this.router.post(
      LOGIN,
      userValidationMiddleware(loginAuthenticationSchema),
      this.login
    );
    this.router.post(LOGOUT, authenticatedMiddleware, this.logout);
    this.router.get(ME, authenticatedMiddleware, this.me);
    this.router.put(
      CHANGE_PASSWORD,
      authenticatedMiddleware,
      userValidationMiddleware(updatePasswordAuthenticationSchema),
      this.changePassword
    );
    this.router.put(
      UPDATE,
      authenticatedMiddleware,
      userValidationMiddleware(updateAuthenticationSchema),
      this.update
    );
    this.services = new UserService();
  };

  register = async (req, res, next) => {
    try {
      const { user, refreshToken, accessToken } = await this.services.register(
        req.body
      );
      return res
        .cookie("auth_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expire: 36000 * Date.now(),
        })
        .json({ user, refreshToken, accessToken });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
  login = async (req, res, next) => {
    try {
      const { user, refreshToken, accessToken } = await this.services.login(
        req.body
      );
      return res
        .cookie("auth_token", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          expire: 36000 * Date.now(),
        })
        .json({ user, refreshToken, accessToken });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

  // LOGOUT CONTROLLER
  logout = async (req, res, next) => {
    try {
      const cookies = req.cookies;
      if (!cookies?.auth_token) return res.status(400).send();
      const refreshToken = cookies.auth_token;

      // check if refresh token is found in the database
      await jwt.sign(refreshToken, "", { expiresIn: 1 });
      const foundUser = await Token.findOne({
        where: { authToken: refreshToken },
      });
      if (!foundUser) {
        return res.status(400).send();
      }

      // delete refresh token from user's model
      await Token.update(
        { authToken: "" },
        { where: { UserId: foundUser.id } }
      );

      return res.clearCookie("auth_token").status(200).send();
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

  // FETCH USER DATA
  me = async (req, res, next) => {
    try {
      const { id } = req.user;
      const foundUser = await Users.findByPk(id);
      return res.send(extractObjectData(foundUser, "password"));
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

  update = async (req, res, next) => {
    try {
      const { id } = req.user;
      const result = await this.services.update(req.body, id);

      return res.json(result);
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

  changePassword = async (req, res, next) => {
    try {
      const { id } = req.user;
      const result = await this.services.changePassword(req.body, id);
      return res.send(result);
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
}
export default UserResource;

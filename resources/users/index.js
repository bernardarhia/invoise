import { Router } from "express";
import authenticatedMiddleware from "../../middleware/authenticatedMiddleware.js";
import Token from "../../models/Token.js";
import httpException from "../../utils/exceptions/httpException.js";
import UserService from "./service.js";
import {
  loginAuthenticationSchema,
  updateAuthenticationSchema,
  userValidationMiddleware,
  authenticationSchema,
} from "./validation.js";

class UserResource {
  constructor() {
    this.subRoute = "users";
    this.routes = {
      LOGIN: "/login",
      REGISTER: "/register",
      LOGOUT: "/logout",
      UPDATE: "/update",
      CHANGE_PASSWORD: "/change-password",
      ME: "/me",
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
    this.router.post(LOGOUT, this.logout);
    this.router.get(ME, authenticatedMiddleware, this.me);
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
      if (!cookies?.auth_token) return res.status(200);
      const refreshToken = cookies.auth_token;
      // check if refresh token is found in the database
      const foundUser = await Token.findOne({
        where: { authToken: refreshToken },
      });
      if (!foundUser) {
        return res.clearCookie("auth_token").status(200).send();
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
      return res.json(req.user);
    } catch (error) {
      next(new httpException(400, "an error occurred"));
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
}
export default UserResource;

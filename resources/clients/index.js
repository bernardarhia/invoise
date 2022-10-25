import { Router } from "express";
import authenticatedMiddleware from "../../middleware/authenticatedMiddleware.js";
import isAdminMiddleware from "../../middleware/isAdminMiddleware.js";
import httpException from "../../utils/exceptions/httpException.js";
import UserService from "./service.js";
import { clientSchema, clientValidationMiddleware } from "./validation.js";

class ClientResource {
  constructor() {
    this.subRoute = "clients";
    this.routes = {
      CREATE: "/create",
      DELETE: "/delete/:clientId",
    };
    this.router = new Router();
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    const { CREATE, DELETE } = this.routes;
    this.router.post(
      CREATE,
      authenticatedMiddleware,
      isAdminMiddleware,
      clientValidationMiddleware(clientSchema),
      this.create
    );
    this.router.delete(
      DELETE,
      authenticatedMiddleware,
      isAdminMiddleware,
      this.delete
    );
    this.services = new UserService();
  };

  create = async (req, res, next) => {
    try {
      const { id } = req.user;
      const client = await this.services.create(req.body, id);
      return res.status(201).json(client);
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };

  delete = async (req, res, next) => {
    try {
      const { clientId } = req.params;
      const { id } = req.user;
      const result = this.services.delete(clientId, id);
      return res.json({result});
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
}
export default ClientResource;

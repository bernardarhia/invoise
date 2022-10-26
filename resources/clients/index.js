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
      FETCH: "/:clientId",
      FETCH_ALL: "",
      UPDATE: "/update/:clientId",
    };
    this.router = new Router();
    this.initializeRoutes();
  }

  initializeRoutes = () => {
    const { CREATE, DELETE, FETCH, FETCH_ALL, UPDATE } = this.routes;
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
    this.router.get(
      FETCH,
      authenticatedMiddleware,
      isAdminMiddleware,
      this.fetchClient
    );
    this.router.get(
      FETCH_ALL,
      authenticatedMiddleware,
      isAdminMiddleware,
      this.fetchAllClients
    );
    this.router.put(
      UPDATE,
      authenticatedMiddleware,
      isAdminMiddleware,
      this.update
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
      const result = await this.services.delete(clientId, id);

      return res.send({ success: Boolean(result) });
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
  fetchClient = async (req, res, next) => {
    try {
      const { clientId } = req.params;
      const { id } = req.user;
      const client = await this.services.fetchClient(clientId, id);
      return res.status(200).json(client);
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
  fetchAllClients = async (req, res, next) => {
    try {
      const { id } = req.user;
      const client = await this.services.fetchAllClients(id);
      return res.status(200).json(client);
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
  update = async (req, res, next) => {
    try {
      const { id } = req.user;
      const { clientId } = req.params;

      const client = await this.services.update(req.body, clientId, id);
      return res.status(200).json(client);
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
}
export default ClientResource;

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
      DELETE: "/:clientId/delete",
      FETCH: "/:clientId",
      FETCH_ALL: "",
      UPDATE: "/:clientId/update",
      STATUS_UPDATE: "/:clientId/status",
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
      clientValidationMiddleware(clientSchema),
      this.update
    );
    this.router.put(
      STATUS_UPDATE,
      authenticatedMiddleware,
      isAdminMiddleware,
      this.toggleActivation
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

  toggleActivation = async (req, res, next) => {
    try {
      const { clientId } = req.params;
      const { activationStatus } = req.body;
      const result = await this.services.toggleActivation(
        activationStatus,
        clientId
      );
      return res.status(200).send(result);
    } catch (error) {
      next(new httpException(400, error.message));
    }
  };
}
export default ClientResource;

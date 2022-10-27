import Clients from "../../models/Client.js";
import Users from "../../models/User.js";

export default class UserService {
  create = async (body, id) => {
    try {
      let client;
      let user;

      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        country,
        city,
        address,
        website,
      } = body;
      // check if the email is the same as the admin's email
      const adminEmail = await Users.findByPk(id);
      if (adminEmail.email === email)
        throw new Error("Client email shouldn't be the same as admin's");
      user = await Users.create({ firstName, lastName, password, email });
      if (user) {
        // create client
        client = await Clients.create({
          phone,
          country,
          city,
          address,
          website,
          createdBy: id,
          UserId: user.id,
        });
      }
      return {
        firstName,
        lastName,
        email,
        phone,
        country,
        city,
        address,
        website,
        id: user.id,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };

  delete = async (clientId, id) => {
    try {
      const user = await Users.findOne({
        where: { id: clientId },
        include: Clients,
      });

      if (!user) throw new Error("User not found");

      if (user.role != "client") throw new Error("Invalid user found");
      if (user.clients[0].createdBy != id) throw new Error("unknown user");

      const result = await Users.destroy({ where: { id: clientId } });
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  fetchClient = async (clientId, id) => {
    try {
      const client = await Clients.findOne({
        where: { UserId: clientId, createdBy: id },
        include: Users,
      });
      if (!client) throw new Error("Client not found");
      return { client };
    } catch (error) {
      throw new Error(error.message);
    }
  };
  fetchAllClients = async (id) => {
    try {
      const clients = await Clients.findAll({
        where: { createdBy: id },
        include: {
          model: Users,
          attributes: ["firstName", "lastName", "email"],
        },
      });
      if (!clients) throw new Error("Clients not found");
      return clients;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  /**  //TODO - Update client profile and other details with ease
    update format
    extract details that goes into users table and update 
    extract details that goes into clients table and update
    return the newly updated details
  */
  update = async (body, clientId, id) => {
    try {
      const {
        firstName,
        lastName,
        phone,
        country,
        city,
        address,
        website,
      } = body;
      const updatedClient = await Clients.update(
        {phone, country, city, address, website},
        {
          where: { createdBy: id, UserId: clientId },
        }
      );

      const updatedUser = await Users.update({firstName, lastName}, {where:{
        id:clientId
      }})

      if(updatedClient && updatedUser) return body;
      throw new Error("Unable to update user")
    } catch (error) {
      throw new Error(error.message);
    }
  };
  toggleActivation = async(activationStatus, id)=>{
    try {
      const user = await Users.update({active : activationStatus}, {id})
      return user;
    } catch (error) {
      throw new Error(error.message)
    }
  }}

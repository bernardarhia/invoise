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

  delete = async(clientId, id)=>{
    try {
      const user = await Users.findByPk(clientId);
      return user;
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

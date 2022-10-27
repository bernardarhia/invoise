import Users from "../../models/User.js";
import { hashPassword, verifyPassword } from "../../utils/password.js";
import { assignToken } from "../../utils/token.js";

export default class UserService {
  register = async (body) => {
    try {
      const { firstName, lastName, email, password, } = body;
      const user = await Users.create({ firstName, lastName, email, password, role:"admin" });

      const result = await assignToken(user);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  login = async (body) => {
    const { email, password } = body;
    try {
      const user = await Users.findOne({ where: { email } });

      // if user doesn't exist
      if (!user) throw new Error("Wrong email/password combination 1");

      // verify user password
      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) throw new Error("Wrong email/password combination");

      if(user.role == "client" && user.active == false)throw new Error("Your account is inactive. Contact admin to activate it for you")
      const result = await assignToken(user);
      return result;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  update = async (body, id) => {
    try {
      const { firstName, lastName } = body;

      const updatedUser = await Users.update(
        { firstName, lastName },
        { where: { id } }
      );
      if (!updatedUser) throw new Error("Unable to update user details");
      return await Users.findByPk(id);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  changePassword = async (body, id) => {
    const { oldPassword, newPassword } = body;

    try {
      const user = await Users.findByPk(id);
      const isPasswordValid = await verifyPassword(oldPassword, user.password);

      if (!isPasswordValid) throw new Error("Invalid password entered");
      const newPasswordIsSameAsOld = await verifyPassword(
        newPassword,
        user.password
      );

      if (newPasswordIsSameAsOld)
        throw new Error("New password is the same as old password");

      const password = await hashPassword(newPassword);

      const updatedPassword = await Users.update(
        { password },
        { where: { id } }
      );

      if (updatedPassword) return true;
    } catch (error) {
      throw new Error(error.message);
    }
  };
}

import bcrypt from "bcrypt";
const hashPassword = async (password) => {
  try {
    const newPassword = password + process.env.SALT;
    const hashed = await bcrypt.hash(
      newPassword,
      Number(process.env.PASSWORD_SALT)
    );
    return hashed;
  } catch (error) {
    throw new Error(error);
  }
};

const verifyPassword = async (password, hashedPassword) => {
  try {
    const newPassword = password + process.env.SALT;
    return await bcrypt.compare(newPassword, hashedPassword);
  } catch (error) {
    throw new Error(error);
  }
};
export { hashPassword, verifyPassword };

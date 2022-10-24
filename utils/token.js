import jwt from "jsonwebtoken";
import Token from "../models/Token.js";

const createToken = (user) => {
  const { id, email } = user;
  return jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};
const createRefreshToken = (user) => {
  const { id, email } = user;
  return jwt.sign({ id, email }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "1d",
  });
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) return reject(err);

      resolve(payload);
    });
  });
};

const assignToken = async (user) => {
  const { firstName, lastName, email, id } = user;
  const accessToken = createToken(user);
  const refreshToken = createRefreshToken(user);

  // check if user has token
  const tokenExists = await Token.findOne({ where: { UserId: id } });

  console.log("tokenExists", tokenExists);
  if (!tokenExists) await Token.create({ authToken: refreshToken, UserId: id });
  else
    await Token.update(
      {
        authToken: refreshToken,
      },
      {
        where: {
          UserId: id,
        },
      }
    );

  return {
    user: { firstName, lastName, email, id },
    accessToken,
    refreshToken,
  };
};
export { createToken, verifyToken, createRefreshToken, assignToken };

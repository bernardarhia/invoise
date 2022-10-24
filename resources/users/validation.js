import Joi from "joi";

const authenticationSchema = Joi.object({
  firstName: Joi.string().min(3).max(20).required().label("First name"),
  lastName: Joi.string().min(3).max(20).required().label("Last name"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(8).max(16).alphanum().required().label("Password"),
});
const loginAuthenticationSchema = Joi.object({
  email: Joi.string().email().required().label("Email"),
  password: Joi.string().min(8).max(16).alphanum().required().label("Password"),
});

const updateAuthenticationSchema = Joi.object({
  firstName: Joi.string().min(3).max(20).required().label("First name"),
  lastName: Joi.string().min(3).max(20).required().label("Last name"),
});
const updatePasswordAuthenticationSchema = Joi.object({
  oldPassword: Joi.string().min(3).required().label("Password"),
  newPassword: Joi.any()
    .equal(Joi.ref("oldPassword"))
    .required()
    .label("Confirm password")
    .options({ messages: { "any.only": "{{#label}} does not match" } }),
});

const userValidationMiddleware = (schema) => {
  return async (req, res, next) => {
    const validationsOptions = {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
    };

    try {
      const value = await schema.validateAsync(req.body, validationsOptions);
      req.body = value;
      next();
    } catch (e) {
      const errors = [];
      e.details.forEach((error) => {
        errors.push(error.message);
      });
      res.status(400).send({ errors });
    }
  };
};

export {
  userValidationMiddleware,
  authenticationSchema,
  updateAuthenticationSchema,
  updatePasswordAuthenticationSchema,
  loginAuthenticationSchema,
};

import Joi from "joi";

const clientSchema = Joi.object({
  firstName: Joi.string().min(3).max(20).required().label("First name"),
  lastName: Joi.string().min(3).max(20).required().label("Last name"),
  email: Joi.string().email().required().label("Email"),
  password: Joi.string()
    .min(8)
    .max(16)
    .alphanum()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .label("Password")
    .options({ messages: { "any.pattern": "{{#label}} should have contain uppercase, lowercase and special characters" }}),
    phone:Joi.string().length(10).required().label("Phone"),
    country:Joi.string().min(3).required().label("Country"),
    city:Joi.string().min(3).required().label("Country"),
    address:Joi.string().min(3).required().label("Address"),
    website:Joi.string().label("Website"),
    note:Joi.string().label("Note")
});

const clientValidationMiddleware = (schema) => {
  return async (req, res, next) => {
    const validationsOptions = {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
      errors: {
        wrap: {
          label: ''
        }
      }
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
clientSchema,clientValidationMiddleware
};

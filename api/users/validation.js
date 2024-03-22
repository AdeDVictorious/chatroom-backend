let Joi = require('joi');
// // .extend()
// let { celebrate } = require('celebrate');

const { celebrate } = require('celebrate');

class userValidation {
  //validation for signup
  validateSignup() {
    return celebrate({
      body: Joi.object({
        nickname: Joi.string().lowercase().required(),
        fullname: Joi.string().lowercase().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(15).required(),
        image: Joi.string().uri().required(),
      }),
    });
  }

  //validation for login
  validateLogin() {
    return celebrate({
      body: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(15).required(),
      }),
    });
  }

  //validation for req.params (req.params)
  validateParams() {
    return celebrate({
      params: Joi.object({
        // when using UUID
        // id: Joi.string().guid({ version: 'uuidv4' }).required(),

        // when using mongodb _id
        id: Joi.string().alphanum().min(24).max(24).required(),
      }),
    });
  }

  // validation query parameters (req.query)
  validateQuery() {
    return celebrate({
      query: Joi.object({
        // when using UUID
        // id: Joi.string().guid({ version: 'uuidv4' }).required(),

        // when using mongodb generate id
        id: Joi.string().alphanum().min(24).max(24).required(),
      }),
    });
  }

  ///validation to update users
  validateUpdate() {
    return celebrate({
      body: Joi.object({
        nickname: Joi.string().lowercase().required(),
      }),
    });
  }
}

module.exports = userValidation;

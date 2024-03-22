let Joi = require('joi');
// .extend()
let { celebrate } = require('celebrate');

class groupValidation {
  //validation for new group
  validateCreate() {
    return celebrate({
      body: Joi.object({
        // when using UUID
        // creator_id: Joi.string().guid({ version: 'uuidv4' }).required(),

        // when using mongodb _id
        creator_id: Joi.string().alphanum().min(24).max(24).required(),
        name: Joi.string().lowercase().required(),
        image: Joi.string().uri().required(),
        limit: Joi.number().integer().min(1).max(100).required(),
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

        // when using mongodb _id
        id: Joi.string().alphanum().min(24).max(24).required(),
      }),
    });
  }

  ///validation to User_id and group_id
  validateUpdate() {
    return celebrate({
      body: Joi.object({
        id: Joi.string().alphanum().min(24).max(24).required(),
        group_name: Joi.string().lowercase().required(),
        image: Joi.string().uri().required(),
        group_limit: Joi.number().integer().min(1).max(100).required(),
        last_limit: Joi.number().integer().min(1).max(100).required(),
      }),
    });
  }
}

module.exports = groupValidation;

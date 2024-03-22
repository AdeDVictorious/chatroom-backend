let Joi = require('joi');
// .extend()
let { celebrate } = require('celebrate');

class contactValidation {
  //validation for new contact
  validateCreate() {
    return celebrate({
      body: Joi.object({
        // // when using UUID
        // user_id: Joi.string().guid({ version: 'uuidv4' }).required(),
        // contact_id: Joi.string().guid({ version: 'uuidv4' }).required(),

        // when using mongodb _id
        user_id: Joi.string().alphanum().min(24).max(24).required(),
        contact_id: Joi.string().alphanum().min(24).max(24).required(),
      }),
    });
  }

  //validation for join contact to user list
  validateUser() {
    return celebrate({
      body: Joi.object({
        // // when using UUID
        // user_id: Joi.string().guid({ version: 'uuidv4' }).required(),
        // contact_id: Joi.string().guid({ version: 'uuidv4' }).required(),

        // when using mongodb _id
        user_id: Joi.string().alphanum().min(24).max(24).required(),
        contact_id: Joi.string().alphanum().min(24).max(24).required(),
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
  validate_Ids() {
    return celebrate({
      body: Joi.object({
        // // when using UUID
        // user_id: Joi.string().guid({ version: 'uuidv4' }).required(),
        // contact_id: Joi.string().guid({ version: 'uuidv4' }).required(),

        // when using mongodb _id
        user_id: Joi.string().alphanum().min(24).max(24).required(),
        contact_id: Joi.string().alphanum().min(24).max(24).required(),
      }),
    });
  }
}

module.exports = contactValidation;

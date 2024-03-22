let Joi = require('joi');
// .extend()
let { celebrate } = require('celebrate');

class chatsValidation {
  //validation for new group chats
  validateCreate() {
    return celebrate({
      body: Joi.object({
        // when using UUID
        // sender_id: Joi.string().guid({ version: 'uuidv4' }).required(),
        // group_id: Joi.string().guid({ version: 'uuidv4' }).required(),
        // message: Joi.string().lowercase().required(),

        // when using mongodb _id
        sender_id: Joi.string().alphanum().min(24).max(24).required(),
        group_id: Joi.string().alphanum().min(24).max(24).required(),
        message: Joi.string().lowercase().required(),
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

  ///validation to User_id and group_id
  validateUpdate() {
    return celebrate({
      body: Joi.object({
        // when using UUID
        // id: Joi.string().guid({ version: 'uuidv4' }).required(),

        // when using mongodb _id
        id: Joi.string().alphanum().min(24).max(24).required(),
      }),
    });
  }

  //   // validation query parameters (req.query)
  //   validateQuery() {
  //     return celebrate({
  //       query: Joi.object({
  //         id: Joi.string().guid({ version: 'uuidv4' }).required(),
  //       }),
  //     });
  //   }
}

module.exports = chatsValidation;

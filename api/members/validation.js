let Joi = require('joi');
// .extend()
let {celebrate} = require('celebrate');

class memberValidation {
  //validation for new member
  validateCreate() {
    return celebrate({
      body: Joi.object({
        // when using UUID
        //  group_id: Joi.string().guid({ version: 'uuidv4' }).required(),
        // let (member for members) {
        // member: Joi.string().guid({ version: 'uuidv4' }).required(),
        // }

        // when using mongodb _id
        group_id: Joi.string().alphanum().min(24).max(24).required(),
        // let (member for members) {
        member: Joi.string().alphanum().min(24).max(24).required(),
        // }
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
        //  // when using UUID
        // group_id: Joi.string().guid({ version: 'uuidv4' }).required(),
        // user_id: Joi.string().guid({ version: 'uuidv4' }).required(),

        // when using mongodb _id
        group_id: Joi.string().alphanum().min(24).max(24).required(),
        user_id: Joi.string().alphanum().min(24).max(24).required(),
      }),
    });
  }
}

module.exports = memberValidation;

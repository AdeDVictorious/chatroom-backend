let express = require('express');
let authUser = require('../../middleware/authUser');
let Service = require('./service');

let group_Chat_Route = express.Router();

let chatsValidation = require('./validation');
let validation = new chatsValidation();

// post or create a new group message
group_Chat_Route.post(
  '/new_group_chat',
  validation.validateCreate(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.body };
      let services = new Service();
      let resp = await services.new_group_chat(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// get group chat by ID
group_Chat_Route.get(
  '/group_chat/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.params };
      let services = new Service();
      let resp = await services.get_groupChatById(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// get all group chats
group_Chat_Route.get('/all_group_chat', authUser, async (req, res) => {
  try {
    let services = new Service();
    let resp = await services.getAll_Groupchat();
    res.status(resp.status).json(resp);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update chat by ID
group_Chat_Route.put(
  '/update_groupById/:id',
  validation.validateUpdate(),
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.params, ...req.body };
      let services = new Service();
      let resp = await services.update_groupChatById(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// delete chat by ID
group_Chat_Route.delete(
  '/delete_group/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.params };
      let services = new Service();
      let resp = await services.delete_groupsById(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

module.exports = { group_Chat_Route };

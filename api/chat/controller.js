let express = require('express');
let authUser = require('../../middleware/authUser');
let Service = require('./service');

let chatRoute = express.Router();

let chatValidation = require('./validation');
let validation = new chatValidation();

// post a new chat message
chatRoute.post(
  '/add_new_chat',
  validation.validateCreate(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.body };
      let services = new Service();
      let resp = await services.new_chat(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// get chat by ID
chatRoute.get(
  '/get_chat/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let data = { ...req.params };
      let services = new Service();
      let resp = await services.get_chatById(data);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// update chat by ID
chatRoute.put(
  '/update_chat/:id',
  validation.validateUpdate(),
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.params, ...req.body };
      let services = new Service();
      let resp = await services.update_chatById(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// get all chat
chatRoute.get('/get_all_chat', authUser, async (req, res) => {
  try {
    let services = new Service();
    let resp = await services.getAll_chat();
    res.status(resp.status).json(resp);
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete chat by ID
chatRoute.delete(
  '/delete_chat/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let data = { ...req.params };
      let services = new Service();
      let resp = await services.delete_chatById(data);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

module.exports = chatRoute;

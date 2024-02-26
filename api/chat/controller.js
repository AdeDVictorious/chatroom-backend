let express = require('express');
let authUser = require('../../middleware/authUser');
let Service = require('./service');

let chatRoute = express.Router();

chatRoute.post('/add_new_chat', authUser, async (req, res) => {
  let data = { ...req.body };
  let services = new Service();
  let resp = await services.new_chat(data);
  res.status(resp.status).json(resp);
});

chatRoute.get('/getChat_by_id/:id', authUser, async (req, res) => {
  let data = { ...req.params };
  let services = new Service();
  let resp = await services.get_chatById(data);
  res.status(resp.status).json(resp);
});

chatRoute.put('/updateChat_by_id/:id', authUser, async (req, res) => {
  let data1 = { ...req.params, ...req.body };
  let services = new Service();
  let resp = await services.update_chatById(data1);
  res.status(resp.status).json(resp);
});

chatRoute.get('/get_all_chat', authUser, async (req, res) => {
  let services = new Service();
  let resp = await services.getAll_chat();
  res.status(resp.status).json(resp);
});

chatRoute.delete('/deleteChat_by_id/:id', authUser, async (req, res) => {
  let data = { ...req.params };
  let services = new Service();
  let resp = await services.delete_chatById(data);
  res.status(resp.status).json(resp);
});

module.exports = chatRoute;

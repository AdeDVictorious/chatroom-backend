let express = require('express');
let authUser = require('../../middleware/authUser');
let Service = require('./service');

let group_Route = express.Router();

group_Route.post('/new_group', authUser, async (req, res) => {
  let payload = { ...req.body };
  let services = new Service();
  let resp = await services.new_group(payload);
  res.status(resp.status).json(resp);
});

group_Route.get('/getAll_group', authUser, async (req, res) => {
  let payload = { ...req.userInfo };
  let services = new Service();
  let resp = await services.getAll_group(payload);
  res.status(resp.status).json(resp);
});

group_Route.get('/groupChat/:id', authUser, async (req, res) => {
  let payload = { ...req.params };
  let services = new Service();
  let resp = await services.get_groupById(payload);
  res.status(resp.status).json(resp);
});

group_Route.put('/update_groupById', authUser, async (req, res) => {
  let payload = { ...req.body };
  let services = new Service();
  let resp = await services.update_groupById(payload);
  res.status(resp.status).json(resp);
});

group_Route.delete('/delete_group/:id', authUser, async (req, res) => {
  let payload = { ...req.params };
  let services = new Service();
  let resp = await services.delete_groupById(payload);
  res.status(resp.status).json(resp);
});

module.exports = { group_Route };

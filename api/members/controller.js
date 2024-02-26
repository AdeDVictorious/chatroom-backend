let express = require('express');
let url = require('url');
let authUser = require('../../middleware/authUser');
let Service = require('./service');

let memberRoute = express.Router();

memberRoute.post('/get_members', authUser, async (req, res) => {
  let payload = { ...req.body };
  let services = new Service();
  let resp = await services.get_members(payload);
  res.status(resp.status).json(resp);
});

// Add a member by group creator/Admin
memberRoute.post('/add_members', authUser, async (req, res) => {
  let payload = { ...req.body };
  let services = new Service();
  let resp = await services.add_members(payload);
  res.status(resp.status).json(resp);
});

// Join a group via shared_link
memberRoute.post('/join_members', authUser, async (req, res) => {
  let payload = { ...req.body };
  let services = new Service();
  let resp = await services.join_members(payload);
  res.status(resp.status).json(resp);
});

memberRoute.get('/get_members/:id', authUser, async (req, res) => {
  let payload = { ...req.params };
  console.log(payload, 'what is getting here');
  let services = new Service();
  let resp = await services.get_membersById(payload);
  res.status(resp.status).json(resp);
});

memberRoute.get('/get_member/:id', authUser, async (req, res) => {
  let payload = { ...req.params };
  let userInfo = { ...req.userInfo };
  let services = new Service();
  let resp = await services.get_mmber(payload, userInfo);
  res.status(resp.status).json(resp);
});

module.exports = memberRoute;

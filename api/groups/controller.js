let express = require('express');
let authUser = require('../../middleware/authUser');
let Service = require('./service');

let group_Route = express.Router();

let groupValidation = require('./validation');
let validation = new groupValidation();

// Post a new group
group_Route.post(
  '/new_group',
  validation.validateCreate(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.body };
      let services = new Service();
      let resp = await services.new_group(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Get all group
group_Route.get('/getAll_group', authUser, async (req, res) => {
  try {
    let payload = { ...req.userInfo };
    let services = new Service();
    let resp = await services.getAll_group(payload);
    res.status(resp.status).json(resp);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get group by ID
group_Route.get(
  '/groupChat/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.params };
      let services = new Service();
      let resp = await services.get_groupById(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// To get all groups created and joined
group_Route.get('/get_groups', authUser, async (req, res) => {
  try {
    let payload = { ...req.userInfo };
    let services = new Service();
    let resp = await services.get_groups(payload);
    res.status(resp.status).json(resp);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update group by ID
group_Route.put(
  '/update_groupById',
  validation.validateUpdate(),
  // validation.validateQuery(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.body, ...req.query };
      console.log(payload);
      let services = new Service();
      let resp = await services.update_groupById(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// delete group by ID
group_Route.delete(
  '/delete_group/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.params };
      let services = new Service();
      let resp = await services.delete_groupById(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

module.exports = { group_Route };

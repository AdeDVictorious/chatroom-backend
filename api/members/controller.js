let express = require('express');
let authUser = require('../../middleware/authUser');
let Service = require('./service');

let memberRoute = express.Router();

let memberValidation = require('./validation');
let validation = new memberValidation();

//this will get all the members in a group
memberRoute.post(
  '/get_members',
  validation.validate_Ids(),
  // authUser,
  async (req, res) => {
    try {
      let payload = { ...req.body };
      let services = new Service();
      let resp = await services.get_members(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Add a member by group creator/Admin
memberRoute.post(
  '/add_members',
  // validation.validateCreate(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.body };
      let services = new Service();
      let resp = await services.add_members(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// check membership validity a group via shared_link
memberRoute.get(
  '/check_member/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.params };
      let userInfo = { ...req.userInfo };
      let services = new Service();
      let resp = await services.check_member(payload, userInfo);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Join a group via shared_link
memberRoute.post(
  '/join_members',
  validation.validate_Ids(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.body };
      let services = new Service();
      let resp = await services.join_members(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// get all member by Group ID
memberRoute.get(
  '/get_members/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.params };
      let services = new Service();
      let resp = await services.get_membersById(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

memberRoute.get(
  '/get_member/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.params };
      let userInfo = { ...req.userInfo };
      let services = new Service();
      let resp = await services.get_mmber(payload, userInfo);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

memberRoute.delete(
  '/delete_member/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.params };
      let services = new Service();
      let resp = await services.delete_member(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

module.exports = memberRoute;

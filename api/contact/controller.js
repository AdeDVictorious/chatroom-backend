let express = require('express');
let authUser = require('../../middleware/authUser');
let contactValidation = require('./validation');
let Service = require('./service');

let contactRoute = express.Router();

let validation = new contactValidation();


// Add a contact by group creator/Admin
contactRoute.post(
  '/add_contacts',
  validation.validateCreate(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.body };
      let services = new Service();
      let resp = await services.add_contacts(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// validite/check contact_id via shared_link
contactRoute.get(
  '/check_contact/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.params };
      let userInfo = { ...req.userInfo };
      let services = new Service();
      let resp = await services.check_contact(payload, userInfo);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// Join a group via shared_link
contactRoute.post(
  '/join_contacts',
  validation.validateUser(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.body };
      let services = new Service();
      let resp = await services.join_contacts(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// get contact by contact_id and User_id
contactRoute.get(
  '/find_contact/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let userInfo = { ...req.userInfo };
      let payload = { ...req.params };
      let services = new Service();
      let resp = await services.get_contactById(payload, userInfo);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// get all contacts assoicated to UserID
contactRoute.get('/get_contacts', authUser, async (req, res) => {
  try {
    let userInfo = { ...req.userInfo };
    let services = new Service();
    let resp = await services.all_contacts(userInfo);
    res.status(resp.status).json(resp);
  } catch (error) {
    res.status(500).json(error);
  }
});

// delete contact by ID
contactRoute.delete(
  '/delete_contact/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.params };
      let services = new Service();
      let resp = await services.delete_contact(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

module.exports = { contactRoute };

let express = require('express');
let authUser = require('../../middleware/authUser');
let userValidation = require('./validation');
let Service = require('./service');

let userRoute = express.Router();
let signupRoute = express.Router();
let loginRoute = express.Router();

let validation = new userValidation();

// Signup route
signupRoute.post('/signup', validation.validateSignup(), async (req, res) => {
  try {
    let payload = { ...req.body };
    let services = new Service();
    let resp = await services.new_user(payload);
    res.status(resp.status).json(resp);
  } catch (error) {
    res.status(500).json(error);
  }
});

// login route
loginRoute.post('/login', validation.validateLogin(), async (req, res) => {
  try {
    let data = { ...req.body };
    let services = new Service();
    let resp = await services.user_login(data);
    res.status(resp.status).json(resp);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Dashboard
userRoute.get(
  '/dashboard',
  validation.validateQuery(),
  authUser,
  async (req, res) => {
    try {
      let data = { ...req.query };
      let services = new Service();
      let resp = await services.dashboard(data);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// my_profile /share contact_id via shared_link
userRoute.get('/my_profile', authUser, async (req, res) => {
  try {
    let payload = { ...req.userInfo };
    let services = new Service();
    let resp = await services.my_profile(payload);
    res.status(resp.status).json(resp);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get User by ID
userRoute.get(
  '/getUser/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let data = { ...req.params };
      let services = new Service();
      let resp = await services.get_userById(data);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// get all Users
userRoute.get('/get_all_users', authUser, async (req, res) => {
  try {
    let services = new Service();
    let resp = await services.get_all_users();
    res.status(resp.status).json(resp);
  } catch (error) {
    res.status(500).json(error);
  }
});

// update User by ID
userRoute.put(
  '/updateUser/:id',
  validation.validateUpdate(),
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let payload = { ...req.params, ...req.body };
      let services = new Service();
      let resp = await services.update_userById(payload);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

// delete User by ID
userRoute.delete(
  '/deleteUser/:id',
  validation.validateParams(),
  authUser,
  async (req, res) => {
    try {
      let data = { ...req.params };
      let services = new Service();
      let resp = await services.delete_userById(data);
      res.status(resp.status).json(resp);
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

module.exports = { userRoute, signupRoute, loginRoute };

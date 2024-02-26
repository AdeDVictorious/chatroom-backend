let express = require('express');
let url = require('url');
let authUser = require('../../middleware/authUser');
let Service = require('./service');

let userRoute = express.Router();

userRoute.get('/dashboard', authUser, async (req, res) => {
  let data = { ...req.query };
  let services = new Service();
  let resp = await services.dashboard(data);
  res.status(resp.status).json(resp);
});

userRoute.post('/addUser', async (req, res) => {
  let data = { ...req.body };
  console.log(data, 'data2');
  let services = new Service();
  let resp = await services.new_user(data);
  res.status(resp.status).json(resp);
});

userRoute.post('/login_user', async (req, res) => {
  let data = { ...req.body };
  let services = new Service();
  let resp = await services.user_login(data);
  res.status(resp.status).json(resp);
});

userRoute.get('/getUser_by_id/:id', async (req, res) => {
  let data = { ...req.params };
  console.log(data);
  let services = new Service();
  let resp = await services.getUserById(data);
  res.status(resp.status).json(resp);
});

userRoute.get('/get_all_users', async (req, res) => {
  let services = new Service();
  let resp = await services.get_all_users();
  res.status(resp.status).json(resp);
});

userRoute.get('/updateUser_by_id/:id', async (req, res) => {
  let data1 = { ...req.params, ...req.body };
  console.log(data1);
  let services = new Service();
  let resp = await services.updateUserById(data1);
  res.status(resp.status).json(resp);
});

userRoute.delete('/deleteUser_by_id/:id', async (req, res) => {
  let data = { ...req.params };
  let services = new Service();
  let resp = await services.deleteUserById(data);
  res.status(resp.status).json(resp);
});

module.exports = userRoute;

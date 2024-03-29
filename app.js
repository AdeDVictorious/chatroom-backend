let express = require('express');
let mongoose = require('mongoose');
let dotenv = require('dotenv');
let socket_server = require('./wsServer');
let { isCelebrateError } = require('celebrate');

let cors = require('cors');

let { userRoute, signupRoute, loginRoute } = require('./api/users/controller');
let { contactRoute } = require('./api/contact/controller');
let chatRoute = require('./api/chat/controller');
let { group_Route } = require('./api/groups/controller');
let memberRoute = require('./api/members/controller');
let { group_Chat_Route } = require('./api/group_chats/controller');

const app = express();

dotenv.config({ path: 'config.env' });

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let dbConnect = async () => {
  try {
    let connect = await mongoose.connect(process.env.MongoDB_CONNECTION);
    console.log('connection to mongodb was successful');
  } catch (err) {
    console.log('failed to connect mongodb');
  }
};

dbConnect();

app.use('/api/v1', signupRoute, loginRoute);
app.use('/api/v1/user', userRoute);
app.use('/api/v1/contacts', contactRoute);
app.use('/api/v1/chat', chatRoute);
app.use('/api/v1/group_chat', group_Route);
app.use('/api/v1/members', memberRoute);
app.use('/api/v1/groups_Chat', group_Chat_Route);

app.use((error, _, res, next) => {
  console.log(error, 'error');
  if (isCelebrateError(error)) {
    const errorMessage =
      error.details.get('body') ||
      error.details.get('query') ||
      error.details.get('params');
    const message = errorMessage?.message?.replace(/"/g, '');
    res.status(422).json({ errMsg: message });
  }
  next();
});

let PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    console.log('server failed to start');
    process.env.exit();
  } else {
    console.log(`app is running on port: ${PORT}`);
  }
});

// websocket connection initialize
socket_server();

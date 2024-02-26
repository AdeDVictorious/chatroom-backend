let express = require('express');
let mongoose = require('mongoose');
let dotenv = require('dotenv');
let socket_server = require('./wsServer');

let cors = require('cors');

let chatRoute = require('./api/chat/controller');
let { group_Route } = require('./api/groups/controller');
let userRoute = require('./api/users/controller');
let memberRoute = require('./api/members/controller');
let { group_Chat_Route } = require('./api/group_chats/controller');

const app = express();

dotenv.config({ path: 'config.env' });

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(express.static('public'));

let dbConnect = async () => {
  try {
    let connect = await mongoose.connect(
      'mongodb+srv://adegoke0813:Kenny22123@chatapp.av3tuih.mongodb.net/chatApp?retryWrites=true&w=majority'
    );
    console.log('connection to mongodb was successful');
  } catch (err) {
    console.log('failed to connect mongodb');
  }
};

dbConnect();

// // Express route
// app.get('/', (req, res) => {

//   res.send('Hello, this is an Express server with WebSocket!');
// });

app.use('/api/v1/user', userRoute);
app.use('/api/v1/chat', chatRoute);
app.use('/api/v1/group_chat', group_Route);
app.use('/api/v1/members', memberRoute);
app.use('/api/v1/groups_Chat', group_Chat_Route);

let PORT = process.env.PORT || 5000;

app.listen(PORT, (err) => {
  if (err) {
    console.log('server failed to start');
    process.env.exit();
  } else {
    console.log(`app is running on port: ${PORT}`);
  }
});

socket_server();

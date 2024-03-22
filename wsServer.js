module.exports = () => {
  const WebSocket = require('ws');
  let http = require('http');
  let User = require('./models/userModel');

  let { handle_ws_message } = require('./ws_processors/handleWSMessage');

  const server = http.createServer();

  let wss = new WebSocket.Server({ server });

  let PORT = process.env.WEBSOCKET_PORT || 3000;

  server.listen(PORT, (err) => {
    if (!err) {
      console.log('Websocket is listening on port:', PORT);
    } else {
      console.log(err);
    }
  });

  let clients = new Map();

  wss.on('connection', async (ws, req) => {
    ////connection handshake
    //using the backend to test while
    // let client_id = req.headers['sec-websocket-protocol'];

    const client_id = req.url.split('user_id=')[1];

    console.log(client_id, 'client_id');

    ////using the frontend to test
    // let client_id = req.headers['sec-websocket-key'];

    clients.set(client_id, ws);

    // console.log(clients, 'Clients');

    let payload = {
      status: 'Online',
      statuscode: 200,
      message: 'connection was suceessfull',
      user_id: client_id,
    };

    if (!client_id) {
      ///if the user is not authenticated the client_id will be missing
      let data = {
        status: 'Offline',
        statusCode: 404,
        message: 'connection was not successfull',
      };

      // Send the ID to the connected client
      ws.send(JSON.stringify({ data }));
    } else {
      //update users status to Online
      await User.findByIdAndUpdate(
        { _id: client_id },
        { $set: { is_online: '1' } }
      );

      // broadcast user online status
      wss.clients.forEach(async (client) => {
        if (client.readyState === WebSocket.OPEN) {
          let payload = {
            status: 'online',
            statuscode: 200,
            message: 'connection was suceessfull',
            user_id: client_id,
          };

          // Send to the client
          client.send(JSON.stringify({ status: 200, payload }));
        }
      });
    }

    ///Incoming message from the client
    ws.on('message', async (data) => {
      handle_ws_message(data, ws, clients);
    });

    ////Detecting close event or connection or server shoutdown
    ws.on('close', async () => {
      console.log(`Status Offline: ${client_id}`);

      //update users status to Offline
      await User.findByIdAndUpdate(
        { _id: client_id },
        { $set: { is_online: '0' } }
      );

      // broadcast to all clients when a new client connects
      wss.clients.forEach(async (client) => {
        if (client.readyState === WebSocket.OPEN) {
          //Send the payload to client
          let payload = {
            status: 'offline',
            statuscode: 200,
            message: 'User is offline',
            user_id: client_id,
          };

          client.send(JSON.stringify({ status: 200, payload }));
        }
      });

      // delete client_id from the client map()
      clients.delete(client_id);
    });
  });
};

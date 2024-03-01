let Chat = require('../models/chatModel');

let send_chat_message = async (data_parse, clients) => {
  try {
    let from = data_parse.data.sender_id;
    let to = data_parse.data.receiver_id;
    let text = data_parse.data.message;

    let receiver = clients.get(`${to}`);
    let sender = clients.get(`${from}`);

    // console.log(sender, 'we have a sender in here');
    // console.log(receiver, 'we have a receiver in here');
    if (!receiver) {
      //User not online but message saved to database
      let data = {
        sender_id: from,
        receiver_id: to,
        message: text,
      };

      let new_chat = await Chat.create(data);

      sender.send(
        JSON.stringify({
          status: 200,
          payload: { status: 'sender_chat', new_msg: new_chat },
        })
      );
    } else {
      //User is online & message saved to database and sent to receiver
      let data = {
        sender_id: from,
        receiver_id: to,
        message: text,
      };

      let new_chat = await Chat.create(data);

      // Receiver payload
      let payload = {
        status: 'chat_received',
        message: text,
        sender: from,
        recipient: to,
        new_msg: new_chat,
      };

      // responses to the receiver and sender
      receiver.send(JSON.stringify({ status: 200, payload }));
      sender.send(
        JSON.stringify({
          status: 200,
          payload: { status: 'sender_chat', new_msg: new_chat },
        })
      );
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
};

module.exports = {
  send_chat_message,
};

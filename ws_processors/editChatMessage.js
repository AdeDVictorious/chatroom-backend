let Chat = require('../models/chatModel');

let edit_chat_message = async (data_parse, clients) => {
  try {
    let from = data_parse.data.sender_id;
    let to = data_parse.data.receiver_id;
    let text = data_parse.data.message;
    let chat_id = data_parse.data.id;

    console.log(from, to, text, chat_id);

    let receiver = clients.get(`${to}`);
    let sender = clients.get(`${from}`);

    // console.log(receiver, 'we have a receiver in here');
    if (!receiver) {
      //User not online but message saved to database
      let data = {
        message: text,
      };

      let chat = await Chat.findByIdAndUpdate({ _id: chat_id }, data);
      let updated_msg = await Chat.findById({ _id: chat_id });

      sender.send(
        JSON.stringify({
          status: 200,
          payload: { status: 'update_sender_chat', new_msg: updated_msg },
        })
      );
    } else {
      //User is online & message saved to database and sent to receiver
      let data = {
        message: text,
      };

      let chat = await Chat.findByIdAndUpdate({ _id: chat_id }, data);

      let updated_msg = await Chat.findById({ _id: chat_id });

      // Receiver payload
      let payload = {
        status: 'update_recipient_chat',
        new_msg: updated_msg,
      };

      // responses to the receiver and sender
      receiver.send(JSON.stringify({ status: 200, payload }));
      sender.send(
        JSON.stringify({
          status: 200,
          payload: { status: 'update_sender_chat', new_msg: updated_msg },
        })
      );
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
};

module.exports = {
  edit_chat_message,
};

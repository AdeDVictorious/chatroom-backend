let Chat = require('../models/chatModel');

let delete_chat_message = async (data_parse, clients) => {
  try {
    let id = data_parse.data.id;

    let data = {
      id: id,
    };

    let from = data_parse.data.sender_id;
    let to = data_parse.data.receiver_id;

    let receiver = clients.get(`${to}`);

    if (!receiver) {
      //User not online but message saved to database

      await Chat.findByIdAndDelete({ _id: data.id });
    } else {
      //User is online & message saved to database and sent to receiver
      await Chat.findByIdAndDelete({ _id: data.id });

      let payload = {
        status: 'chat_deleted',
        chat_id: data.id,
      };

      receiver.send(JSON.stringify({ status: 204, payload }));
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
};

module.exports = {
  delete_chat_message,
};

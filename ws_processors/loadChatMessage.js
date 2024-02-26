let Chat = require('../models/chatModel');

let load_chat_message = async (data_parse, ws) => {
  try {
    let sender_id = data_parse.data.sender_id;
    let receiver_id = data_parse.data.receiver_id;

    let chats = await Chat.find({
      $or: [
        { sender_id: sender_id, receiver_id: receiver_id },
        { sender_id: receiver_id, receiver_id: sender_id },
      ],
    });

    payload = {
      status: 'load_chats',
      statuscode: 200,
      chats: chats,
    };

    ws.send(JSON.stringify({ status: 200, payload }));
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
};

module.exports = {
  load_chat_message,
};

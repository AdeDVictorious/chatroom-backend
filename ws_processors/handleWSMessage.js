// let clients = require('./ws_processors/client_id');
let { load_chat_message } = require('./loadChatMessage');
let { send_chat_message } = require('./sendChatMessage');
let { edit_chat_message } = require('./editChatMessage');
let { delete_chat_message } = require('./deleteChatMessage');

let handle_ws_message = async (data, ws, clients) => {
  let bufferData = data.toString();

  //Parse the data to Object
  let data_parse = JSON.parse(bufferData);

  //This will handle the data coming from the client-side
  if (data_parse.load_chat) {
    //handle Load chats of each user
    load_chat_message(data_parse, ws);
  } else if (data_parse.send_chat) {
    // handle sending chat to user
    send_chat_message(data_parse, clients);
  } else if (data_parse.edit_chat) {
    //handle editing user chat
    edit_chat_message(data_parse, clients);
  } else if (data_parse.delete_chat) {
    //handle deleting user chat
    delete_chat_message(data_parse, clients);
  }
};

module.exports = {
  handle_ws_message,
};

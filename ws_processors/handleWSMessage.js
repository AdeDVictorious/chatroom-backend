let { load_chat_message } = require('./loadChatMessage');
let { send_chat_message } = require('./sendChatMessage');
let { edit_chat_message } = require('./editChatMessage');
let { delete_chat_message } = require('./deleteChatMessage');
let { load_group_chats } = require('./loadGroupChat');
let { send_group_chats } = require('./sendGroupChatMsg');
let { edit_group_chats } = require('./editGroupChatMsg');
let { delete_group_chats } = require('./deleteGroupChatMsg');

let handle_ws_message = async (data, ws, clients) => {
  let bufferData = data.toString();

  console.log(bufferData, 'bufferData');

  //Parse the data to Object
  let data_parse = JSON.parse(bufferData);

  //This will handle the data coming from the client-side
  if (data_parse.load_chat) {
    //handle Load chats of each user
    load_chat_message(data_parse, ws);
  } else if (data_parse.send_chat) {
    // handle sending user to user chat
    send_chat_message(data_parse, clients);
  } else if (data_parse.edit_chat) {
    //handle editing user chat
    edit_chat_message(data_parse, clients);
  } else if (data_parse.delete_chat) {
    //handle deleting user chat
    delete_chat_message(data_parse, clients);
  } else if (data_parse.load_group_chat) {
    //handle group_id into an array
    load_group_chats(data_parse, ws);
  } else if (data_parse.send_group_chat) {
    //handle sending message in group chat
    send_group_chats(data_parse, ws, clients);
  } else if (data_parse.edit_group_chat) {
    //handle editing message in group chat
    edit_group_chats(data_parse, ws, clients);
  } else if (data_parse.delete_group_chat) {
    //handle delete message in group chat
    delete_group_chats(data_parse, ws, clients);
  }
};

module.exports = {
  handle_ws_message,
};

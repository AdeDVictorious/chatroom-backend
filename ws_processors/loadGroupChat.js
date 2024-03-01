// ------ Load group chat ----- //
let Group_Chat = require('../models/group_chatModel');

let load_group_chats = async (data_parse, ws) => {
  try {
    let group_id = data_parse.data.group_id;

    let chats = await Group_Chat.find({ group_id: group_id }).populate(
      'sender_id'
    );

    payload = {
      status: 'load_group_chats',
      statuscode: 200,
      chats: chats,
    };

    ws.send(JSON.stringify({ status: 200, payload }));
  } catch (error) {
    console.error('Error parsing JSON:', error);
    payload = {
      status: 'Error loading group chats',
      statuscode: 404,
    };

    ws.send(JSON.stringify({ status: 404, payload }));
  }
};

module.exports = {
  load_group_chats,
};

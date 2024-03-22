let Group_Chat = require('../models/group_chatModel');
let Member = require('../models/memberModel');

let send_group_chats = async (data_parse, ws, clients) => {
  try {
    //  format the data
    let from = data_parse.data.sender_id;
    let to = data_parse.data.group_id;
    let text = data_parse.data.message;

    let data = {
      sender_id: from,
      group_id: to,
      message: text,
    };

    // Save new message to the database
    let chats = await Group_Chat.create(data);

    // find all members with the Group_ID from the database
    let get_members = await Member.find({ group_id: data.group_id });

    let new_group_msg = await Group_Chat.findOne({ _id: chats._id }).populate(
      'sender_id'
    );

    // Receiver payload to be sent to user
    let payload = {
      status: 'group_chat_received',
      message: text,
      sender_id: from,
      group_id: to,
      new_msg: new_group_msg,
    };

    ///// ----- Broadcast the message to all clients in the same group ----- /////
    for (let member of get_members) {
      // get the user_id from the member
      let to = member.user_id.toString();

      let receiver = clients.get(`${to}`);

      if (receiver !== undefined) {
        receiver.send(JSON.stringify({ status: 200, payload }));
      } else {
        console.log(`User ${to} is offline`);
      }
    }

    // send to the creator of the group
    let creator_id = data_parse.data.creator_id;

    let receiver = clients.get(`${creator_id}`);

    if (!receiver) {
      console.log(`User ${creator_id} is offline`);
    } else {
      receiver.send(JSON.stringify({ status: 200, payload }));
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
    // payload incase of error
    let payload = {
      status: 'error sending message',
      statuscode: 400,
    };

    ws.send(JSON.stringify({ status: 400, payload }));
  }
};

module.exports = {
  send_group_chats,
};

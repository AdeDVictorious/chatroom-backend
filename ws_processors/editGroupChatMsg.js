let Group_Chat = require('../models/group_chatModel');
let Member = require('../models/memberModel');

let edit_group_chats = async (data_parse, ws, clients) => {
  try {
    //  format the data
    let groupChat_id = data_parse.data.id;
    let text = data_parse.data.message;
    // let from = data_parse.data.sender_id;
    let group_id = data_parse.data.group_id;

    // User is online & message saved to database and sent to receiver
    let data = {
      message: text,
    };

    let chat = await Group_Chat.findByIdAndUpdate({ _id: groupChat_id }, data);

    let updated_msg = await Group_Chat.findById({ _id: groupChat_id }).populate(
      'sender_id'
    );

    // Receiver payload
    let payload = {
      status: 'updateGroup_recipient_chat',
      new_msg: updated_msg,
    };

    // find all members with the Group_ID from the database
    let get_members = await Member.find({ group_id: group_id });

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
      console.log(`creator_id ${creator_id} is offline`);
    } else {
      receiver.send(JSON.stringify({ status: 200, payload }));
    }
  } catch (error) {
    console.error('Error updating:', error);
    // payload incase of error
    let payload = {
      status: 'updating error message',
      statuscode: 404,
    };

    ws.send(JSON.stringify({ status: 404, payload }));
  }
};

module.exports = {
  edit_group_chats,
};

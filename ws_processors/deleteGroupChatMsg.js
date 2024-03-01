let Group_Chat = require('../models/group_chatModel');
let Member = require('../models/memberModel');

let delete_group_chats = async (data_parse, ws, clients) => {
  try {
    //  format the data
    let group_id = data_parse.data.group_id;
    let groupChat_id = data_parse.data.id;

    let data = {
      id: groupChat_id,
    };

    //User is online & message saved to database and sent to receiver
    await Group_Chat.findByIdAndDelete({ _id: data.id });

    // find all members with the Group_ID from the database
    let get_members = await Member.find({ group_id: group_id });

    //payload to be sent back to the frontend
    let payload = {
      status: 'chat_deleted',
      chat_id: data.id,
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
      console.log(`creator_id ${creator_id} is offline`);
    } else {
      receiver.send(JSON.stringify({ status: 200, payload }));
    }
  } catch (error) {
    console.error('Error parsing JSON:', error);
    // payload incase of error
    let payload = {
      status: 'error deleting message',
      statuscode: 404,
    };

    ws.send(JSON.stringify({ status: 404, payload }));
  }
};

module.exports = {
  delete_group_chats,
};

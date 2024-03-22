let { Group_Chat } = require('./model');

class Services {
  // post or create a new group message
  async new_group_chat(payload) {
    try {
      //check if the input is empty
      if (!payload.sender_id || !payload.group_id || !payload.message) {
        return { status: 422, message: 'Kindly fill all require field' };
      } else {
        // format the data
        let data = {
          sender_id: payload.sender_id,
          group_id: payload.group_id,
          message: payload.message,
        };

        //add to the database
        let new_groupChat = await Group_Chat.create(data);

        //return responses to the user
        return {
          status: 201,
          message: 'Group chat was added successfully',
          new_groupChat,
        };
      }
    } catch (err) {
      console.log(err.message);
      return { status: 400, message: 'error adding chat message' };
    }
  }

  // get chat by ID
  async get_groupChatById(payload) {
    try {
      let get_Group = await Group_Chat.findById({ _id: payload.id });

      if (!get_Group) {
        return { status: 404, message: 'this ID is not found' };
      } else {
        return {
          status: 200,
          message: 'Group message was found successfully',
          get_Group,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting Group  message',
      };
    }
  }

  async getAll_Groupchat() {
    try {
      let get_Msg = await Group_Chat.find();

      return {
        status: 200,
        message: 'All group chat message was found successfully',
        dbCount: get_Msg.length,
        get_Msg,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting all group chat message',
      };
    }
  }

  // update chat by ID
  async update_groupChatById(payload) {
    try {
      // chat message is empty
      if (!payload.message) {
        return {
          status: 400,
          message: 'Kindly supply the message to be updated',
        };
      }

      let getMsg = await Group_Chat.findOne({ _id: payload.id });

      if (!getMsg) {
        return { status: 404, message: 'this ID is not found' };
      } else {
        // format the payload
        let data = { message: payload.message };

        let get_Msg = await Group_Chat.updateOne({ _id: payload.id }, data);

        let updatedMsg = await Group_Chat.findOne({ _id: payload.id });

        return {
          status: 200,
          message: 'Group chat message was updated successfully',
          updatedMsg,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error updating group chat message',
      };
    }
  }

  // Delete chat by ID
  async delete_groupsById(payload) {
    try {
      // check if data exist
      let getMsg = await Group_Chat.findOne({ _id: payload.id });

      if (!getMsg) {
        return { status: 404, message: 'this ID is not found' };
      } else {
        let get_Msg = await Group_Chat.deleteOne({ _id: getMsg.id });

        return {
          status: 204,
          message: 'Group chat message was deleted successfully',
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error deleting group chat message',
      };
    }
  }
}

module.exports = Services;

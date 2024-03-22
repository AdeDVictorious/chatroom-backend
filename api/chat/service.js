let { Chat } = require('./model');

class Services {
  // post a new chat
  async new_chat(payload) {
    try {
      //check if the input is empty
      if (!payload.sender_id || !payload.receiver_id || !payload.message) {
        return { status: 400, message: 'Kindly fill all require field' };
      } else {
        // format the data
        let data = {
          sender_id: payload.sender_id,
          receiver_id: payload.receiver_id,
          message: payload.message,
        };

        //add to the database
        let new_chat = await Chat.create(data);

        //return responses to the user
        return {
          status: 201,
          message: 'Chat was added successfully',
          new_chat,
        };
      }
    } catch (err) {
      console.log(err.message);
      return { status: 400, message: 'error adding chat message' };
    }
  }

  // get chat by ID
  async get_chatById(data) {
    try {
      // check if chat exist
      let get_Msg = await Chat.findOne({ _id: data.id });

      // if chat is not found
      if (!get_Msg) {
        return { status: 404, message: 'this ID is not found' };
      }

      return {
        status: 200,
        message: 'Chat with ID was found successfully',
        get_Msg,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting chat message',
      };
    }
  }

  // update chat by ID
  async update_chatById(payload) {
    try {
      // chat message is empty
      if (!payload.message) {
        return {
          status: 400,
          message: 'Kindly supply the message to be updated',
        };
      }

      let getMsg = await Chat.findOne({ _id: payload.id });

      if (!getMsg) {
        return { status: 404, message: 'this ID is not found' };
      } else {
        // format the payload
        let data = { message: payload.message };

        let get_Msg = await Chat.updateOne({ _id: payload.id }, data);

        let updatedMsg = await Chat.findOne({ _id: payload.id });

        return {
          status: 200,
          message: 'chat message was updated successfully',
          updatedMsg,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error updating chat message',
      };
    }
  }

  // Get all chat message
  async getAll_chat() {
    try {
      let get_Msg = await Chat.find();

      return {
        status: 200,
        message: 'All chat message was found successfully',
        dbCount: get_Msg.length,
        get_Msg,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting All chatroom message',
      };
    }
  }

  // Delete chat by ID
  async delete_chatById(data) {
    try {
      // check if data exist
      let getMsg = await Chat.findOne({ _id: data.id });

      if (!getMsg) {
        return { status: 404, message: 'this ID is not found' };
      }

      let get_Msg = await Chat.deleteOne({ _id: getMsg.id });

      return {
        status: 204,
        message: 'chat message was deleted successfully',
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting chatroom message',
      };
    }
  }
}

module.exports = Services;

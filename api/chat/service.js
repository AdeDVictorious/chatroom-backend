let { Chat } = require('./model');

class Services {
  async new_chat(data) {
    try {
      //check if the input is empty
      if (!data.sender_id || !data.receiver_id || !data.message) {
        return { status: 400, message: 'Kindly fill all require field' };
      }

      //add to the database
      let new_chat = await Chat.create(data);

      console.log(new_chat, 'this is the chat');

      //return responses to the user
      return {
        status: 201,
        message: 'Chat was added successfully',
        new_chat,
      };
    } catch (err) {
      console.log(err.message);
      return { status: 400, message: 'error adding chat', errMsg: err.message };
    }
  }

  async get_chatById(data) {
    try {
      let get_Msg = await Chat.findById({ _id: data.id });

      if (!get_Msg) {
        return { status: 404, message: 'this ID is not found' };
      }

      return {
        status: 200,
        message: 'chat message was found successfully',
        get_Msg,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting chatroom message',
        errMsg: err.message,
      };
    }
  }

  async update_chatById(data1) {
    try {
      if (!data1.message) {
        return {
          status: 400,
          message: 'Kindly supply the message to be updated',
        };
      }

      let data = { message: data1.message };

      let getMsg = await Chat.findOne({ _id: data1.id });

      if (!getMsg) {
        return { status: 404, message: 'this ID is not found' };
      }

      let get_Msg = await Chat.updateOne({ _id: data1.id }, data);

      let updatedMsg = await Chat.findOne({ _id: data1.id });

      return {
        status: 200,
        message: 'chat message was updated successfully',
        updatedMsg,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error updating chat message',
        errMsg: err.message,
      };
    }
  }

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
        errMsg: err.message,
      };
    }
  }

  async delete_chatById(data) {
    try {
      let getMsg = await Chat.findOne({ _id: data.id });

      console.log(getMsg, 'I am here');

      if (!getMsg) {
        return { status: 404, message: 'this ID is not found' };
      }

      let get_Msg = await Chat.deleteOne({ _id: getMsg.id });

      return {
        status: 204,
        message: 'chat message was deleted successfully',
        get_Msg,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting chatroom message',
        errMsg: err.message,
      };
    }
  }
}

module.exports = Services;

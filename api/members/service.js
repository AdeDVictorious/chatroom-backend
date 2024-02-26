let { User, Member } = require('./model');
let jwt = require('jsonwebtoken');
let mongoose = require('mongoose');
const bcrypt = require('bcrypt');

class Services {
  async get_members(payload) {
    try {
      // format the payload
      let data = {
        group_id: payload.group_id,
        user_id: payload.user_id,
      };

      //find all but exclude the id passed into
      let users = await User.aggregate([
        {
          $lookup: {
            from: 'members',
            localField: '_id',
            foreignField: 'user_id',
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $eq: [
                          '$group_id',
                          new mongoose.Types.ObjectId(data.group_id),
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            as: 'member',
          },
        },
        {
          $match: {
            _id: {
              $nin: [new mongoose.Types.ObjectId(data.user_id)],
            },
          },
        },
      ]);

      return {
        status: 200,
        message: 'All users message was found successfully',
        dbCount: users.length,
        users,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting All users',
      };
    }
  }

  // Add a member by group creator/Admin
  async add_members(payload) {
    try {
      // check if the payload is not empty
      if (!payload.group_id || !payload.limit || !payload.members) {
        return { status: 200, message: 'group_id or user_id is missing' };
      }

      // // Check if Member with data info exist & delete it
      await Member.deleteMany({
        group_id: payload.group_id,
      });

      // format the payload
      let data = [];
      // let activeData = [];

      let members = payload.members;

      //push the group_id and the user_id in members array to data
      for (let member of members) {
        // format the payload
        // let dat_a = {
        //   group_id: payload.group_id,
        //   user_id: member,
        // };

        // // find Member with data info
        // let get_member = await Member.find({
        //   group_id: dat_a.group_id,
        //   user_id: dat_a.user_id,
        // });

        // if (get_member.length === 0) {
        //   data.push({
        //     group_id: payload.group_id,
        //     user_id: member,
        //   });
        // } else if (get_member.length > 0) {
        //   // Assuming ObjectId is a valid constructor or function in your code
        //   let extractedData = get_member.map((item) => {
        //     let groupId = item.group_id;
        //     let userId = item.user_id;
        //     return { groupId, userId };
        //   });

        //   activeData.push({
        //     extractedData,
        //   });
        // } else {
        //   data.push({
        //     group_id: payload.group_id,
        //     user_id: member,
        //   });
        // }
        data.push({
          group_id: payload.group_id,
          user_id: member,
        });
      }

      // The data contain group_id and user_id
      // you can have much data it will be inserted into the database
      let addMembers = await Member.insertMany(data);

      return {
        status: 201,
        message: 'New members were added successfully',
        dbCount: addMembers.length,
        addMembers,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting All chatroom message',
      };
    }
  }

  /// Join a group via shared_link
  async join_members(payload) {
    try {
      // check if the payload is not empty
      if (!payload.group_id) {
        return { status: 200, message: 'group_id is missing' };
      }

      // format the payload
      let data = {
        group_id: payload.group_id,
        user_id: payload.user_id,
      };

      // Check if Member with data info exist
      let get_member = await Member.find({
        group_id: data.group_id,
        user_id: data.user_id,
      });
      
      console.log(get_member);

      if (get_member.legnth > 0) {
        return {
          status: 200,
          message: 'Members already exist',
          get_member,
        };
      } else {
        // you can have much data it will be inserted into the database
        let joinMember = await Member.create(data);

        return {
          status: 201,
          message: 'New members added successfully',
          joinMember,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error adding new member',
      };
    }
  }

  // get all member by Group ID
  async get_membersById(payload) {
    try {
      let get_member = await Member.find({ group_id: payload.id });

      if (!get_member) {
        return { status: 404, message: 'this ID is not found' };
      }

      return {
        status: 200,
        message: 'Members found successfully',
        DBCount: get_member.length,
        get_member,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting Members',
      };
    }
  }

  // get member by Group ID and UserID
  async get_mmber(payload, userInfo) {
    try {
      // format the payload
      let data = {
        group_id: payload.id,
        user_id: userInfo.id,
      };

      // find Member with data info
      let get_mmber = await Member.find({
        group_id: data.group_id,
        user_id: data.user_id,
      });

      if (!get_mmber) {
        return { status: 404, message: 'this ID is not found' };
      }

      return {
        status: 200,
        message: 'Members found successfully',
        get_mmber,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting all members',
      };
    }
  }

  async updateUserById(data1) {
    try {
      if (!data1.nickname) {
        return {
          status: 400,
          message: 'Kindly supply the nickname to be updated',
        };
      }

      let data = { nickname: data1.nickname };

      let getUser = await Chat.findOne({ _id: data1.id });

      if (!getUser) {
        return { status: 404, message: 'this ID is not found' };
      }

      let get_Msg = await Chat.updateOne({ _id: data1.id }, data);

      let updated_Msg = await Chat.findOne({ _id: data1.id });

      return {
        status: 200,
        message: 'User nickname was updated successfully',
        updated_Msg,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error updating user nickname',
        errMsg: err.message,
      };
    }
  }

  async get_all_users() {
    try {
      let get_all_user = await User.find();

      return {
        status: 200,
        message: 'All users message was found successfully',
        dbCount: get_all_user.length,
        get_all_user,
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

  async deleteUserById(data) {
    try {
      let getUser = await User.findOne({ _id: data.id });

      if (!getUser) {
        return { status: 404, message: 'this ID is not found' };
      }

      let get_User = await Chat.deleteOne({ _id: getUser.id });

      return {
        status: 204,
        message: 'User message was deleted successfully',
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

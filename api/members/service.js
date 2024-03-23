const { equal } = require('joi');
const My_Contacts = require('../../models/contactModel');
let { User, My_Contact, Member, Group } = require('./model');
let mongoose = require('mongoose');

class Services {
  // get all contact and members of the group
  async get_members(payload) {
    try {
      if (!payload.group_id || !payload.user_id) {
        return { status: 422, message: 'group_id or user_id is missing' };
      }

      // format the payload
      let data = {
        group_id: payload.group_id,
        user_id: payload.user_id,
      };

      ////this is the best way to write the code
      let users = await My_Contact.aggregate([
        {
          $lookup: {
            from: 'members',
            localField: 'contact_id',
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
            user_id: new mongoose.Types.ObjectId(data.user_id),
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'contact_id',
            foreignField: '_id',
            as: 'user',
          },
        },
      ]);

      return {
        status: 200,
        message: 'All members found successfully',
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
        return { status: 422, message: 'group_id or user_id is missing' };
      }

      // // Check if Member with data info exist & delete it
      await Member.deleteMany({
        group_id: payload.group_id,
      });

      // format the payload
      let data = [];

      let members = payload.members;

      //push the group_id and the user_id in members array to data
      for (let member of members) {
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

  // /// check membership eligibilty via shared_link
  async check_member(payload, userInfo) {
    try {
      // check if the payload is not empty
      if (!payload.id) {
        return { status: 422, message: 'group_id is missing' };
      }

      // format the payload
      let data = {
        group_id: payload.id,
        user_id: userInfo.id,
      };

      // find group by ID
      let groupData = await Group.findById({ _id: data.group_id });

      // get all member by Group ID
      let get_member = await Member.find({
        group_id: data.group_id,
        user_id: data.user_id,
      });

      // get all member by Group ID
      let get_members = await Member.find({ group_id: data.group_id });

      let total_members = get_members.length;
      let available = groupData.limit - total_members;

      let isJoined = get_member;

      let isOwner = groupData.creator_id == data.user_id ? true : false;

      if (isOwner === true) {
        return {
          status: 200,
          message:
            'You are the creator of this group, so you cannot join this group',
          groupData,
          available,
          total_members,
          isOwner,
          isJoined,
        };
      } else if (available === 0) {
        return {
          status: 200,
          message: 'Group already filled',
          groupData,
          available,
          total_members,
          isOwner,
          isJoined,
        };
      } else if (isJoined) {
        return {
          status: 200,
          message: 'You have already join this group',
          groupData,
          available,
          total_members,
          isOwner,
          isJoined,
        };
      } else if (available > 0) {
        return {
          status: 200,
          message: `Avaliable for ${available} Members Only`,
          groupData,
          available,
          total_members,
          isOwner,
          isJoined,
        };
      } else {
        return {
          status: 200,
          message: `Avaliable for ${available} Members Only`,
          groupData,
          available,
          total_members,
          isOwner,
          isJoined,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error adding new member',
      };
    }
  }

  /// Join a group via shared_link
  async join_members(payload) {
    try {
      // check if the payload is not empty
      if (!payload.group_id) {
        return { status: 422, message: 'group_id is missing' };
      }

      // format the payload
      let data = {
        group_id: payload.group_id,
        user_id: payload.user_id,
      };

      // Check if ise with data info exist
      let get_creator = await Group.findOne({
        _id: data.group_id,
        creator_id: data.user_id,
      });

      // Check if Member with data info exist
      let get_member = await Member.findOne({
        group_id: data.group_id,
        user_id: data.user_id,
      });

      if (get_creator) {
        return {
          status: 400,
          message:
            'You are the creator of this group, so you cannot join this group',
        };
      } else if (get_member) {
        return {
          status: 400,
          message: 'Member already exist',
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
      } else {
        // return this
        return {
          status: 200,
          message: 'Members found successfully',
          DBCount: get_member.length,
          get_member,
        };
      }
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
      } else {
        return {
          status: 200,
          message: 'Member found successfully',
          get_mmber,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting a member',
      };
    }
  }

  // all member by Group ID and UserID
  async all_members() {
    try {
      let all_members = await Member.find();

      return {
        status: 200,
        message: 'All Members was found successfully',
        dbCount: all_members.length,
        all_members,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error getting all members',
      };
    }
  }

  // delete member by ID
  async delete_member(payload) {
    try {
      let getUser = await Member.findOne({ _id: payload.id });

      if (!getUser) {
        return { status: 404, message: 'this ID is not found' };
      }

      let get_User = await Member.deleteOne({ _id: getUser._id });

      return {
        status: 204,
        message: 'Member was deleted successfully',
      };
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error deleting member',
      };
    }
  }
}

module.exports = Services;

let { Group, Member } = require('./model');

class Services {
  async new_group(payload) {
    try {
      //format the payload
      let data = {
        creator_id: payload.creator_id,
        name: payload.name,
        image: payload.image,
        limit: payload.limit,
      };

      //check if the input is empty
      if (!data.creator_id || !data.name || !data.image || !data.limit) {
        return { status: 400, message: 'Kindly fill all require field' };
      }

      // check if the user already create group with this group_name
      let check4_group = await Group.findOne({
        name: data.name,
        creator_id: data.creator_id,
      });

      if (check4_group) {
        return { status: 400, message: 'This group name already exist' };
      }

      //add to the database
      let new_group = await Group.create(data);

      //return responses to the user
      return {
        status: 201,
        message: 'Group was added successfully',
        new_group,
      };
    } catch (err) {
      console.log(err.message);
      return {
        status: 400,
        message: 'error adding Group',
        errMsg: err.message,
      };
    }
  }

  async get_groups(payload) {
    try {
      let data = { user_id: payload.id };

      // find all and return the last entered as the first
      let myGroup = await Group.find({ creator_id: data.user_id });

      let joinedGroup = await Member.find({ user_id: data.user_id }).populate(
        'group_id'
      );

      return {
        status: 200,
        message: 'All Group message was found successfully',
        myGroup,
        joinedGroup,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting All Grouproom message',
        errMsg: err.message,
      };
    }
  }

  async get_groupsById(payload) {
    try {
      let get_Group = await Group.findById({ _id: payload.id });

      if (!get_Group) {
        return { status: 404, message: 'this ID is not found' };
      }

      return {
        status: 200,
        message: 'Group message was found successfully',
        get_Group,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting Grouproom message',
      };
    }
  }

  async update_groupsById(payload) {
    try {
      let data = {
        name: payload.group_name,
        image: payload.image,
        limit: payload.group_limit,
        last_limit: payload.last_limit,
      };

      // if current limit is < than last limit
      if (parseInt(data.limit) < parseInt(data.last_limit)) {
        await Member.deleteMany({ group_id: payload.id });

        let updtById = await Group.findByIdAndUpdate({ _id: payload.id }, data);

        let updated_Group = await Group.findOne({ _id: payload.id });

        return {
          status: 200,
          message: 'Group was updated successfully',
          updated_Group,
        };
      }

      let updateObj;

      if (data.image != undefined) {
        updateObj = {
          name: data.group_name,
          image: data.image,
          limit: data.group_limit,
        };
      } else {
        updateObj = { name: data.group_name, limit: data.group_limit };
      }

      let updtById = await Group.findByIdAndUpdate({ _id: payload.id }, data);

      let updated_Group = await Group.findOne({ _id: payload.id });

      return {
        status: 200,
        message: 'Group was updated successfully',
        updated_Group,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error updating Group',
      };
    }
  }

  async delete_groupsById(payload) {
    console.log(payload, 'what is going on here');
    try {
      let get_Group = await Group.findOne({ _id: payload.id });

      if (!get_Group) {
        return { status: 404, message: 'this group does not exit' };
      }

      let deleted_Group = await Group.deleteOne({ _id: payload.id });
      let get_Member = await Member.deleteMany({ group_id: payload.id });

      return {
        status: 204,
        message: 'Group deleted successfully',
        deleted_Group,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error deleting Group',
        errMsg: err.message,
      };
    }
  }
}

module.exports = Services;

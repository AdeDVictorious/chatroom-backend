let { Group, Member, Group_Chat } = require('./model');

class Services {
  // Get all group
  async new_group(payload) {
    try {
      //format the payload
      let name = payload.name.trim();

      // form a data to save to database
      let data = {
        creator_id: payload.creator_id,
        name: name,
        image: payload.image,
        limit: payload.limit,
      };

      //check if the input is empty
      if (!data.creator_id || !data.name || !data.image || !data.limit) {
        return { status: 422, message: 'Kindly fill all require field' };
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
      };
    }
  }

  async getAll_group(payload) {
    try {
      let data = { user_id: payload.id };

      // find all and return the last entered as the first
      let getAll_group = await Group.find({ creator_id: data.user_id }).sort({
        _id: -1,
      });

      return {
        status: 200,
        message: 'All Group found successfully',
        dbCount: getAll_group.length,
        getAll_group,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error getting All Group chat',
      };
    }
  }

  // Get group by ID
  async get_groupById(payload) {
    try {
      // find group by ID
      console.log(payload.id);

      let get_Group = await Group.findById({ _id: payload.id });

      if (!get_Group) {
        return { status: 404, message: 'this ID is not found' };
      } else {
        // return this
        return {
          status: 200,
          message: 'Group chat was found successfully',
          get_Group,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        status: 404,
        message: 'Error getting Group by ID',
      };
    }
  }

  // To get all groups created and joined
  async get_groups(payload) {
    try {
      let data = { user_id: payload.id };

      // find all and return the last entered as the first
      let myGroup = await Group.find({ creator_id: data.user_id });

      let joinedGroup = await Member.find({ user_id: data.user_id }).populate(
        'group_id'
      );

      console.log(joinedGroup, 'joinedGroup');

      return {
        status: 200,
        message: 'All Groups were found successfully',
        myGroup,
        joinedGroup,
      };
    } catch (err) {
      console.log(err);
      return {
        status: 400,
        message: 'Error getting All Group messages',
      };
    }
  }

  // Update group by ID
  async update_groupById(payload) {
    try {
      //format the payload
      let group_name = payload.group_name.trim();
      let group_limit = payload.group_limit;

      let data = {
        name: group_name,
        image: payload.image,
        limit: group_limit,
        last_limit: payload.last_limit,
      };

      if (!data.name || !data.image || !data.limit || !data.last_limit) {
        return { status: 400, message: 'Kindly filled required field' };
      } else if (parseInt(data.limit) < parseInt(data.last_limit)) {
        // if current limit is < than last limit
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

  // delete group by ID
  async delete_groupById(payload) {
    try {
      // check if the id exist
      let get_Group = await Group.findOne({ _id: payload.id });

      if (!get_Group) {
        return { status: 404, message: 'this group does not exit' };
      }

      // deleted group with group_id
      let deleted_Group = await Group.deleteOne({ _id: payload.id });

      // delete members from the database
      let get_Member = await Member.deleteMany({ group_id: payload.id });

      // delete members chats in group from the database
      let deleteGroup_chats = await Group_Chat.deleteMany({
        group_id: payload.id,
      });

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
      };
    }
  }
}

module.exports = Services;

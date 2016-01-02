var _ = require('underscore');

var UserPipeline = function() {
  this.waitingUsers = [];
};

UserPipeline.prototype = {
  addUser: function(user) {
    this.waitingUsers.push(user);
  },

  removeUser: function(user) {
    this.waitingUsers.splice(this.waitingUsers.indexOf(_.find(this.waitingUsers, function(testUser) {
      return user.randomString === testUser.randomString;
    })), 1);
  },

  length: function() {
    return this.waitingUsers.length;
  },

  selectRandomUser: function(user) {
    var randomUser;
    while(randomUser === undefined) {
      var waitingUsersToSelectFrom = this.removeUsersWithoutMutating(user);
      var randomUserToTest = waitingUsersToSelectFrom[_.random(0, waitingUsersToSelectFrom.length - 1)];
      if (!this.userIsConnected(randomUserToTest)) {
        randomUser = randomUserToTest;
      }
    }
    return randomUser;
  },

  selectClosestUser: function(user) {
  },

  userIsConnected: function(user) {
    var connectedUsers = _.select(this.waitingUsers, function(testUser) {
      return user.randomString === testUser.randomString;
    });
    return (connectedUsers.length > 1);
  },

  removeUsersWithoutMutating: function(user) {
    return _.reject(this.waitingUsers, function(testUser) {
      return user.randomString === testUser.randomString;
    });
  },

  unconnectedUsers: function() {
    var output = [];
    var self = this;
    _.each(this.waitingUsers, function(user) {
      if (!self.userIsConnected(user)) {
        output.push(user);
      }
    });
    return output;
  },

  availableUsers: function() {
    var unconnected = this.unconnectedUsers();
    return _.reject(unconnected, function(user) {
      return user.randomString === "";
    });
  },

  usersAvailable: function(user) {
    return (
      this.availableUsers().length > 1 ||
      (this.availableUsers().length  === 1 && this.userIsConnected(user))
    )
  }
};

module.exports = UserPipeline;

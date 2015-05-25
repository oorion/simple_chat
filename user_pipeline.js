var _ = require('underscore');

var UserPipeline = function() {
  this.waitingUsers = [];
};

UserPipeline.prototype.addUser = function(user) {
  this.waitingUsers.push(user);
};

UserPipeline.prototype.removeUser = function(user) {
  this.waitingUsers.splice(this.waitingUsers.indexOf(_.find(this.waitingUsers, function(testUser) {
    return user.randomString === testUser.randomString;
  })), 1);
};

UserPipeline.prototype.length = function() {
  return this.waitingUsers.length;
};

UserPipeline.prototype.selectRandomUser = function(user) {
  var randomUser;
  while(randomUser === undefined) {
    var waitingUsersToSelectFrom = this.removeUsersWithoutMutating(user);
    var randomUserToTest = waitingUsersToSelectFrom[_.random(0, waitingUsersToSelectFrom.length - 1)];
    if (!this.userIsConnected(randomUserToTest)) {
      randomUser = randomUserToTest;
    }
  }
  return randomUser;
};

UserPipeline.prototype.userIsConnected = function(user) {
  var connectedUsers = _.select(this.waitingUsers, function(testUser) {
    return user.randomString === testUser.randomString;
  });
  return (connectedUsers.length > 1);
};

UserPipeline.prototype.removeUsersWithoutMutating = function(user) {
  return _.reject(this.waitingUsers, function(testUser) {
    return user.randomString === testUser.randomString;
  });
};

UserPipeline.prototype.unconnectedUsers = function() {
  var output = [];
  var self = this;
  _.each(this.waitingUsers, function(user) {
    if (!self.userIsConnected(user)) {
      output.push(user);
    }
  });
  return output;
};

module.exports = UserPipeline;

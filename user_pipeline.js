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

module.exports = UserPipeline;

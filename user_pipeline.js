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
  //select a random user
  var waitingUsersToSample = _.reject(this.waitingUsers, function(testUser) {
    return user.randomString === testUser.randomString;
  });
  var randomUser = waitingUsersToSample.splice(_.random(0, waitingUsersToSample.length - 1), 1)[0];

  //update the randomly selected user's random string
  randomUser.randomString = user.randomString;
  return randomUser;
};

module.exports = UserPipeline;

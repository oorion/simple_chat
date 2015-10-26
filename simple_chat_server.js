var UserPipeline = require('./user_pipeline');
var User = require('./user');

var SimpleChatServer = function() {
  this.userPipeline = new UserPipeline;
}

SimpleChatServer.prototype.createUser = function(connectCallback) {
  var user = new User("", connectCallback);
  this.userPipeline.addUser(user);
  return user;
}

SimpleChatServer.prototype.userIsReady = function(user, attributes) {
  user.zipcode      = attributes.zipcode;
  user.randomString = attributes.channelId;

  if (this.userPipeline.usersAvailable(user)) {
    var randomUser = this.userPipeline.selectRandomUser(user);
    randomUser.randomString = attributes.channelId;
    user.connectCallback(attributes.channelId);
    randomUser.connectCallback(attributes.channelId);
  }
}

SimpleChatServer.prototype.destroyUser = function(user) {
  this.userPipeline.removeUser(user);
}

SimpleChatServer.prototype.numberOfUsers = function() {
  return this.userPipeline.length();
}

module.exports = SimpleChatServer;

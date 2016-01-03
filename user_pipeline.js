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
    var closestUser;
    while(closestUser === undefined) {
      var waitingUsersToSelectFrom = this.removeUsersWithoutMutating(user);
      var userToTest = waitingUsersToSelectFrom[_.random(0, waitingUsersToSelectFrom.length - 1)];
      if (!this.userIsConnected(userToTest) && this.usersAreClose(user, userToTest)) {
        closestUser = userToTest;
      }
    }
    return closestUser;
  },

  toRadians: function(val) {
    return Math.PI * val / 180;
  },

  usersAreClose: function(user1, user2) {
    var minimumDistanceInKilometers = 999999999999999999; //should be 40000 for tests to pass

    var lat1 = user1.lat
    var lon1 = user1.lon
    var lat2 = user2.lat
    var lon2 = user2.lon
    var R = 6371000; // metres
    var φ1 = this.toRadians(lat1);
    var φ2 = this.toRadians(lat2);
    var Δφ = this.toRadians(lat2-lat1);
    var Δλ = this.toRadians(lon2-lon1);
    var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d < minimumDistanceInKilometers;
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

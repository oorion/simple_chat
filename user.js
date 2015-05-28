var User = function(socket) {
  this.socket = socket;
  this.randomString = "";
  this.ipAddress = "";
}

module.exports = User;

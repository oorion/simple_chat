var User = function(randomString, socket) {
  this.randomString = randomString;
  this.socket = socket;
  this.zipcode = "";
}

module.exports = User;

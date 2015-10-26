var User = function(randomString, connectCallback) {
  this.randomString    = randomString;
  this.connectCallback = connectCallback;
  this.zipcode         = "";
}

module.exports = User;

var User = function(randomString, connectCallback) {
  this.randomString    = randomString;
  this.connectCallback = connectCallback;
  this.lat             = 0;
  this.lon             = 0;
}

User.prototype = {
  assignGeolocation: function(geolocation) {
    this.lat = geolocation[0];
    this.lon = geolocation[1];
  }
}

module.exports = User;

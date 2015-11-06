var User = require('../user');

describe('User', function() {
  it('can be assigned geolocation data', function() {
    var user = new User;

    user.assignGeolocation([1, 2]);

    expect(user.lat).toEqual(1);
    expect(user.lon).toEqual(2);
  });
});

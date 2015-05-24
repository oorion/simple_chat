var UserPipeline = require('./user_pipeline');
var User = require('./user');

describe('UserPipeline', function() {
  it('has an array of users', function() {
    var userPipeline = new UserPipeline;

    user = new User('abc123', '1');
    userPipeline.addUser(user);

    expect(userPipeline.length()).toEqual(1);
  });

  it('can remove users from waitingUsers', function() {
    var userPipeline = new UserPipeline;

    user = new User('abc123', '1');
    userPipeline.addUser(user);
    userPipeline.removeUser(user);

    expect(userPipeline.length()).toEqual(0);
  });
});

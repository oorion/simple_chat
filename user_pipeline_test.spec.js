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

  it('allows a users randomString to be changed', function() {
    var userPipeline = new UserPipeline;

    user = new User('abc123', '1');
    userPipeline.addUser(user);
    user.randomString = 'test';

    expect(userPipeline.waitingUsers[0].randomString).toEqual('test');
  });

  it('can select a random user', function() {
    var userPipeline = new UserPipeline;

    var user1 = new User('abc123', '1');
    var user2 = new User('def456', '2');
    userPipeline.addUser(user1);
    userPipeline.addUser(user2);
    userPipeline.selectRandomUser(user1);

    expect(user1.randomString).toEqual('abc123');
    expect(user2.randomString).toEqual('abc123');
  });
});

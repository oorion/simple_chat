var UserPipeline = require('../user_pipeline');
var User = require('../user');

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
    var selectedUser = userPipeline.selectRandomUser(user1);

    expect(user1.randomString).toEqual('abc123');
    expect(user2.randomString).toEqual('def456');
    expect(selectedUser).toEqual(user2);
  });

  it('can select a random user that is not paired with someone else', function() {
    var userPipeline = new UserPipeline;

    var user1 = new User('xyz123', '1');
    var user2 = new User('def456', '2');
    var user3 = new User('abc123', '3');
    var user4 = new User('abc123', '4');
    userPipeline.addUser(user1);
    userPipeline.addUser(user2);
    userPipeline.addUser(user3);
    userPipeline.addUser(user4);
    var selectedUser = userPipeline.selectRandomUser(user1);

    expect(user1.randomString).toEqual('xyz123');
    expect(user2.randomString).toEqual('def456');
    expect(selectedUser).toEqual(user2);
  });

  it('can remove a user from the pipeline without mutating', function() {
    var userPipeline = new UserPipeline;

    var user1 = new User('xyz123', '1');
    var user2 = new User('def456', '2');
    userPipeline.addUser(user1);
    userPipeline.addUser(user2);
    var tempWaitingUsers = userPipeline.removeUsersWithoutMutating(user1);

    expect(userPipeline.length()).toEqual(2);
    expect(tempWaitingUsers.length).toEqual(1);
    expect(tempWaitingUsers[0]).toEqual(user2);
  });

  it('can identify if a user is connected to someone else', function() {
    var userPipeline = new UserPipeline;

    var user1 = new User('xyz123', '1');
    var user2 = new User('abc123', '2');
    var user3 = new User('abc123', '3');
    userPipeline.addUser(user1);
    userPipeline.addUser(user2);
    userPipeline.addUser(user3);

    expect(userPipeline.userIsConnected(user1)).toEqual(false);
    expect(userPipeline.userIsConnected(user2)).toEqual(true);
  });

  it('can return a list of all non-connected users', function() {
    var userPipeline = new UserPipeline;

    var user1 = new User('a', '1');
    var user2 = new User('b', '2');
    var user3 = new User('b', '3');
    var user4 = new User('c', '4');
    userPipeline.addUser(user1);
    userPipeline.addUser(user2);
    userPipeline.addUser(user3);
    userPipeline.addUser(user4);

    expect(userPipeline.unconnectedUsers().length).toEqual(2);
  });

  it('can return a list of all available users', function() {
    var userPipeline = new UserPipeline;

    var user1 = new User('a', '1');
    var user2 = new User('b', '2');
    var user3 = new User('b', '3');
    var user4 = new User('', '4');
    userPipeline.addUser(user1);
    userPipeline.addUser(user2);
    userPipeline.addUser(user3);
    userPipeline.addUser(user4);

    expect(userPipeline.availableUsers().length).toEqual(1);
    expect(userPipeline.availableUsers()[0]).toEqual(user1);
  });

  it('can select the closest user', function() {
    var userPipeline = new UserPipeline;
    var boulderGeolocation      = [40.0274, -105.2519];
    var albuquerqueGeolocation  = [35.1107, -106.6100];
    var denverGeolocation       = [39.7392, -104.9903];
    var user1 = createUserAndAssignGeolocation('a', boulderGeolocation)
    var user2 = createUserAndAssignGeolocation('b', albuquerqueGeolocation)
    var user3 = createUserAndAssignGeolocation('c', denverGeolocation)
    userPipeline.addUser(user1);
    userPipeline.addUser(user2);
    userPipeline.addUser(user3);

    var selectedUser = userPipeline.selectClosestUser(user1);

    expect(selectedUser).toEqual(user3);
  });
});

function createUserAndAssignGeolocation(randomString, geolocation) {
    var user = new User(randomString, function() {});
    user.assignGeolocation(geolocation);
    return user;
}

var SimpleChatServer = require('../simple_chat_server');

describe('SimpleChatServer', function() {
  function assertUser(user, expectations) {
    expect(user.zipcode).toEqual(expectations.zipcode);
    expect(user.randomString).toEqual(expectations.channelId);
  };

  it('creates and destroys users', function() {
    var server = new SimpleChatServer();

    expect(server.numberOfUsers()).toEqual(0);
    var user = server.createUser(function() {});
    expect(server.numberOfUsers()).toEqual(1);
    server.destroyUser(user);
    expect(server.numberOfUsers()).toEqual(0);
  });

  describe('when a user is ready', function() {
    it('sets their channel id and zip code', function() {
      var server = new SimpleChatServer();
      var user = server.createUser(function() {});
      server.userIsReady(user, {zipcode: "11111", channelId: "chanid"});

      assertUser(user, {zipcode: "11111", channelId: "chanid"});
    });

    it('if another user is available, it sets the other user\'s channel id, and calls both users\' connect callbacks', function() {
      var server = new SimpleChatServer();
      var called = {user1: false, user2: false, user3: false};
      var user1  = server.createUser(function() { called.user1 = true; });
      var user2  = server.createUser(function() { called.user2 = true; });

      // 2 users get connected
      server.userIsReady(user1, {zipcode: "11111", channelId: "chan1"});
      expect(called.user1).toEqual(false);

      server.userIsReady(user2, {zipcode: "22222", channelId: "chan2"});
      expect(called.user1).toEqual(true);
      expect(called.user2).toEqual(true);

      // reset this var to prove the third user doesn't activate them
      called.user1 = called.user2 = false;

      // third does not find them
      var user3 = server.createUser(function() { called.user3 = true; });
      server.userIsReady(user3, {zipcode: "33333", channelId: "chan3"});
      expect(called.user1 || called.user2 || called.user3).toEqual(false);

      assertUser(user1, {zipcode: "11111", channelId: "chan2"});
      assertUser(user2, {zipcode: "22222", channelId: "chan2"});
      assertUser(user3, {zipcode: "33333", channelId: "chan3"});
    });
  });
});

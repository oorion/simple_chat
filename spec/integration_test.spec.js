var io = require('socket.io-client');

var socketURL = 'http://localhost:5000';
var options ={
  transports: ['websocket'],
  'force new connection': true
};

describe("Chat Server",function(done){
  it('should return the same randomString to two users if both send waiting', function(){
    var client1 = io.connect(socketURL, options);
    client1.on('connect', function(data){
      client1.emit('waiting', ['a1', '12345']);
      var client2 = io.connect(socketURL, options);

      client1.on('connect', function(data){
        console.log('here');
        client2.emit('waiting', ['a2', '12345']);

        client2.on('new-connection', function(data){
          console.log('client2 data: ' + data);
          client2.disconnect();
          done();
        });
      });
    });
  });
});

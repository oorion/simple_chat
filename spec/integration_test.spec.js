var io = require('socket.io-client');

var socketURL = 'http://localhost:5000';
var options ={
  transports: ['websocket'],
  'force new connection': true
};

function checkSocket(client) {
  client.on('connect_error', function(data) {
    console.log("\033[31mCONNECTION ERROR! Make sure the server is running\033[0m");
    console.log(data);
  });
}

describe("Chat Server",function(){
  it('should return the same randomString to two users if both send waiting', function(done){
    var client1 = io.connect(socketURL, options);
    var zipCode = '12345';
    checkSocket(client1);

    // var oldEmit  = client1.emit;
    // client1.emit = function (type) {
    //   console.log("EVENT: " + type);
    //   return oldEmit.apply(this, arguments);
    // }

    client1.on('connect', function(data){
      client1.emit('waiting', ['a1', zipCode]);
      var client2 = io.connect(socketURL, options);

      client2.on('connect', function(data){
        var dataSeen = [];

        function checkData(index, data) {
          dataSeen[index] = data;
          if(dataSeen[0] && dataSeen[1]) {
            expect(dataSeen[0]).toEqual(dataSeen[1]);
            client1.disconnect();
            client2.disconnect();
            done();
          }
        }

        client1.on('new-connection', function(data){
          checkData(0, data);
        });

        client2.on('new-connection', function(data){
          checkData(1, data);
        });

        client2.emit('waiting', ['a2', zipCode]);
      });
    });
  });
});

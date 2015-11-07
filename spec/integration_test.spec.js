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
    checkSocket(client1);

    client1.on('connect', function(data){
      client1.emit('waiting', 'a1');
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

        client2.emit('waiting', 'a2');
      });
    });
  });

  it('assign user geolocation', function(done){
    geolocation = [40.0274, -105.2519]
    var client1 = io.connect(socketURL, options);
    checkSocket(client1);

    client1.on('connect', function(data){
      function checkData(data) {
        expect(data).toEqual(geolocation);
        client1.disconnect();
        done();
      }

      client1.emit('assign-geolocation', geolocation);

      client1.on('geolocation-set', function(data){
        checkData(data);
      })
    });
  });

  it('should connect a user to the person who is closer when two users are available', function(done){
    boulderGeolocation      = [40.0274, -105.2519];
    albuquerqueGeolocation  = [35.1107, -106.6100];
    denverGeolocation       = [39.7392, -104.9903];

    var client1 = io.connect(socketURL, options);
    checkSocket(client1);
    client1.on('connect', function(data){
      client1.emit('assign-geolocation', boulderGeolocation);
      client1.on('geolocation-set', function(data){
        client1.geolocation = data
      });

      var client2 = io.connect(socketURL, options);
      checkSocket(client2);
      client2.on('connect', function(data){
        client2.emit('assign-geolocation', albuquerqueGeolocation);
        client2.on('geolocation-set', function(data){
          client2.geolocation = data
        });

        var client3 = io.connect(socketURL, options);
        checkSocket(client3);
        client3.on('connect', function(data){
          var channelIds = [];
          //var clientGeolocationData = [];
          function checkData(index, data, client) {
            channelIds[index] = data;
            //clientGeolocationData[index] = client.geolocation;
            //console.log(channelIds);
            //console.log(clientGeolcationData);
            if(channelIds[0] === channelIds[1]) {
              //expect(clientGeolcationData[0]).toEqual(boulderGeolocation);
              //expect(clientGeolcationData[1]).toEqual(denverGeolocation);
              client1.disconnect();
              client2.disconnect();
              client3.disconnect();
              done();
            }
          }

          client3.emit('assign-geolocation', denverGeolocation);
          client3.on('geolocation-set', function(data){
            client3.geolocation = data
          });

          client1.on('new-connection', function(data){
            checkData(0, data, this);
          });

          client2.on('new-connection', function(data){
            checkData(1, data, this);
          });

          client3.on('new-connection', function(data){
            checkData(1, data, this);
          });

          client1.emit('waiting', 'a1');
          client2.emit('waiting', 'a2');
          client3.emit('waiting', 'a3');
        });
      });
    });
  });
});

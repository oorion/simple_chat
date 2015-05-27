$(document).ready(function() {
  var channel;
  function createNewChannelFor(name) {
    var webrtc = new SimpleWebRTC({
      localVideoEl: 'local-video',
      remoteVideosEl: 'remote-videos',
      autoRequestMedia: true
    });

    webrtc.on('readyToCall', function () {
      webrtc.joinRoom(name);
      channel = name;
    });
  }

  function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) {
      result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
  }

  function generateRandomString() {
    return randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  }

  var socket = io();

  $('.random').on('click', function () {
    $('#remote-videos').html('');
    //webrtc.leaveRoom(channel);
    socket.emit('waiting', generateRandomString());
  });

  socket.on('new-connection', function(channel) {
    console.log('new channel: ' + channel);
    createNewChannelFor(channel);
  });
});

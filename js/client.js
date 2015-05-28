$(document).ready(function() {
  var channel;
  var webrtc;
  function createNewChannelFor(name) {
    if (webrtc === undefined) {
      webrtc = new SimpleWebRTC({
        localVideoEl: 'local-video',
        remoteVideosEl: 'remote-videos',
        autoRequestMedia: true
      });

      webrtc.on('readyToCall', function () {
        webrtc.joinRoom(name);
        channel = name;
      });

      //$('video').css({'height': '100px'});
    } else {
      webrtc.joinRoom(name);
      channel = name;
      //$('#remote-videos').css({'height': '100px'});
    }
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
    $('.random').html('Next');
    if (webrtc != undefined) {
      webrtc.leaveRoom(channel);
    }
    socket.emit('waiting', generateRandomString());
  });

  socket.on('new-connection', function(name) {
    createNewChannelFor(name);
  });
});

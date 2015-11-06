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
    } else {
      webrtc.joinRoom(name);
      channel = name;
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

  function noAvailableUsers() {
    return (webrtc === undefined || webrtc.roomName === undefined);
  }

  function tellUserIfNoAvailableUsers() {
    if (noAvailableUsers()) {
      $('#remote-videos').html('There are no available users connected');
    }
  }

  // function checkForZipcode() {
  //   var $zipcode = $('.zipcode');
  //   $zipcode.keyup(function() {
  //     if ($zipcode.val().length === 5 && !isNaN($zipcode.val())) {
  //       $('.random').removeAttr('disabled');
  //     } else {
  //       $('.random').attr('disabled', 'disabled');
  //     }
  //   });
  // }

  var socket = io();

  $('.random').on('click', function () {
    $('.random').html('Next');
    if (webrtc != undefined) {
      webrtc.leaveRoom(channel);
    }
    socket.emit('waiting', generateRandomString());
    window.setTimeout(tellUserIfNoAvailableUsers, 4000);
  });

  socket.on('new-connection', function(name) {
    $('#remote-videos').html('');
    createNewChannelFor(name);
  });

  var lat;
  var lon;
  navigator.geolocation.getCurrentPosition(GetLocation);
  function GetLocation(location) {
    lat = location.coords.latitude;
    lon = location.coords.longitude;

    socket.emit("assign-geolocation", [lat, lon]);
  }
});

function sendMessage() {
  var mes = document.getElementById("message").value

  let server = document.getElementsByClassName(localStorage.getItem('server')).item(0)
  let channel = server.querySelector('select[name="channels"]').value

  fetch("http://localhost:8080/api/send", {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({'message': mes,
      'serverId': localStorage.getItem('server'),
      'channelId': channel
    })
    }).then(res => {
      console.log("Request complete! response:", res);
    });
}

async function sendTTS() {
  var mes = document.getElementById("tts").value
  var lang = document.getElementById("langs").value
  fetch("http://localhost:8080/api/tts", {
      method: "POST",
      headers: {'Content-Type': 'application/json'}, 
      body: JSON.stringify({'text': mes,
        'serverId': localStorage.getItem('server'),
        'lang': lang,
        'channelId': localStorage.getItem('voiceChannel')
      })
    }).then(res => {
      console.log("Request complete! response:", res.body());
    });
}

async function getLangs() {
  var langsSelector = document.getElementById("langs")
  let langs = []
  await fetch("http://localhost:8080/api/get/languages")
    .then(function(response) {
      return response.json();
    }).then(function(data) {
      langs = data;
    });
  for (let i = 0; i < langs.length; i++) {
    var opt = document.createElement('option')
    opt.value = langs[i]
    opt.innerHTML = langs[i]
    langsSelector.appendChild(opt)
  }
}

async function getInfo() {
  let url = ''
  let name = ''
  let status = ''
  let servers = ''

  let channels

  await fetch("http://localhost:8080/api/bot-avatar")
    .then(function(response) {
      return response.text();
    }).then(function(data) {
      url = data;
    });

  await fetch("http://localhost:8080/api/bot-name")
    .then(function(response) {
      return response.text();
    }).then(function(data) {
      name = data;
    });

  await fetch("http://localhost:8080/api/bot-status")
    .then(function(response) {
      return response.text();
    }).then(function(data) {
      status = data;
    });

  await fetch("http://localhost:8080/api/bot-servers")
    .then(function(response) {
      return response.json();
    }).then(function(data) {
      servers = data;
    });
  

  document.getElementById("avatar").innerHTML = '<img src="' + url + '" alt="Avatar">'
  document.getElementById("name").innerHTML = name
  document.getElementById("status").innerHTML = 'Status: ' + status
  document.getElementById("status").style = status == 'CONNECTED' ? 'color: green;' : 'color: red';
  
  for (let i = 0; i < servers.length; i++) {
    var server = document.getElementById("servers")
    
    server.innerHTML += '<div id="server" class="' + servers[i]['id'] + '">'
      + '<img src="' + servers[i]['icon'] + '" alt="Icon">'
      + '<p>' + servers[i]['name'] + '</p>'
      + '<input type="radio" value="' + servers[i]['id'] + '" name="server" id="serverRadio" onclick="radioServer(this);">'
      + '<select id="channels' + i + '" name="channels"></select>'
      + '</div>'
    if (servers[i]['name'] == "Bot Sandbox") {
      localStorage.setItem("server", servers[i]['id'])
    }

    await fetch("http://localhost:8080/api/server-text-channels", {
      method: 'POST',
      body: servers[i]['id']
    })
    .then(function(response) {
      return response.json();
    }).then(function(data) {
      channels = data;
    });

    let channelsSelector = server.querySelector('#channels' + i)

    for (let channel in channels) {
      var opt = document.createElement('option')
      opt.value = `${channel}`
      opt.innerHTML = `${channels[channel]}`
      channelsSelector.appendChild(opt)
    }
  }

}

function connect() {
  
}

async function updateVoiceChannels() {
  var channels = document.getElementById('voice-channels')
  channels.innerHTML = ''

  let voiceChannels

  await fetch("http://localhost:8080/api/server-voice-channels-connected-number", {
      method: 'POST',
      body: localStorage.getItem('server')
    })
    .then(function(response) {
      return response.json();
    }).then(function(data) {
      voiceChannels = data;
    });

  let i = 0
  for(let channelKey in voiceChannels) {
    console.log(channelKey)
    channels.innerHTML += 
      '<input type="radio" name="voice-channel" value="' + channelKey + '" id="voice-channel' + i + '" onclick="radioVoiceChannel(this);">'
      + '<label for="voice-channel' + i + '">' + voiceChannels[channelKey] + '</label> <br>'
    i++
  }

}

function radioVoiceChannel($this) {
  localStorage.setItem("voiceChannel", $this.value)
}

function radioServer($this) {
  localStorage.setItem("server", $this.value)
  updateVoiceChannels();
}

window.addEventListener('load', function () {
  getInfo();
  getLangs();
})


// timeout request todo???
/*
const controller = new AbortController();

const timeoutId = setTimeout(() => controller.abort(), 5000);

const req = async () => {
  const response = await fetch(url, { signal: controller.signal });
  //...
  clearTimeout(timeoutId);
};
req();
*/
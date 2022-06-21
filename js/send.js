function sendMessage() {
    var mes = document.getElementById("message").value
    fetch("http://localhost:8080/api/send", {
        method: "POST",
        headers: {'Content-Type': 'text/plain'}, 
        body: mes
      }).then(res => {
        console.log("Request complete! response:", res);
      });
}

async function getInfo() {
  let url = ''
  let name = ''
  let status = ''

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
    console.log(status)
  document.getElementById("avatar").innerHTML = '<img src="' + url + '" alt="Avatar">'
  document.getElementById("name").innerHTML = name
  document.getElementById("status").innerHTML = status
  document.getElementById("status").style = status == 'CONNECTED' ? 'color: green;' : 'color: red';

}


window.addEventListener('load', function () {
  getInfo();
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
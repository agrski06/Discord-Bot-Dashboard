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
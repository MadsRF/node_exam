$(document).ready( () => {

const socket = io.connect("http://localhost:8888");


$("#messageSendButton").click(() => {
    const userMessage = { 
      username:  $("#usernameInput").val(),
      message:  $("#messageTextInput").val()   
    };

    console.log(userMessage);

    // emit means to send out
    socket.emit("SentMessage", { userMessage });
    
    // empties text input 
    $("#messageTextInput").val("")

});

socket.on("receivedMessage", data => {
    console.log(data.userMessage)

    $("#messageContainer").append(`<div>${data.userMessage.username}:<br> ${data.userMessage.message}</div><br>`)
    
});

});
$(document).ready( () => {

  // Tells our socket to run on port 8888
  const socket = io.connect(":8888");

  $("#messageSendButton").click(() => {
    
    // Message containing our 2 inputs username and message
    const userMessage = { 
      username:  $("#usernameInput").val(),
      message:  $("#messageTextInput").val()   
    };

    //console.log(userMessage);

    // Emit means to send out
    socket.emit("SentMessage", { userMessage });
      
    // Empties text input after sending 
    $("#messageTextInput").val("")

  });

  // Used to display received message from server
  socket.on("receivedMessage", data => {
    console.log(data.userMessage)

    $("#messageContainer").append(`<div>${data.userMessage.username}:<br> - ${data.userMessage.message}</div><br>`)
    
});

});
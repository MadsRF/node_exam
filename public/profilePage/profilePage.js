$(document).ready( () => {

    // Takes the current url 
    const url = window.location.href;
    let urlFormat = url.substr(0, url.lastIndexOf("/")-12);

    $.get(urlFormat+"/currentProfile", (data) => { 
        $("#username").val(data.foundUser.username);
        $("#password").val(data.foundUser.password);
    });


    $("#profileButton").click( () => {

        let userInfo = {
            username: $("#username").val(),
            password: $("#password").val(),

        }

        console.log(userInfo);

        $.ajax({
            method: "POST",
            url: "/editProfile",
            data: userInfo,
            success: function (status) {
                if (status === true) {
                    alert("user information has been altered");
                    location.replace("/ProfilePage");
                } else {
                    alert("something went wrong");
                }
            }
        });
    });




});
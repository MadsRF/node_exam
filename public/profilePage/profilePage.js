$(document).ready( () => {

    // Takes the current url 
    const url = window.location.href;
    let urlFormat = url.substr(0, url.lastIndexOf("/")-12);

    // Gets current user info from route
    $.get(urlFormat+"/currentProfile", (data) => { 
        $("#username").val(data.foundUser.username);
        $("#password").val(data.foundUser.password);
    });

    // jquery click function to get new info and update userprofile
    $("#profileButton").click( () => {

        let userInfo = {
            username: $("#username").val(),
            password: $("#password").val(),

        }

        console.log(userInfo);

        $.ajax({
            method: "PUT",
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
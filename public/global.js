$(document).ready( () => {

    $("#logout").click( () => {
        alert("You logged out");
        window.location.replace("/logout");
    });

    $("#archivePage").click( () => {
        console.log("Archive");
        window.location.replace("/archivePage");
    });

    $("#orderPage").click( () => {
        console.log("Orders");
        window.location.replace("/orderPage");
    });
    
    $("#itemPage").click( () => {
        console.log("Products");
        window.location.replace("/itemPage");
    });

});
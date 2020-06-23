// Framework for our server
const express = require("express");
const app = express();

// Makes public folder static, so it's always accessable    
app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
 
// parse application/json
app.use(express.json());



// Routes 
app.get(("/"), (req, res) => {
    console.log("login");
    return res.sendFile(__dirname + "/public/loginPage/loginPage.html");
});

app.get("/orderPage", (req, res) => {
    console.log("orderPage");
    return res.sendFile(__dirname + "/public/orderPage/orderPage.html");
});

app.get(("/itemPage"), (req, res) => {
    console.log("itemPage");
    return res.sendFile(__dirname + "/public/itemPage/itemPage.html");
});

app.get(("/archivePage"), (req, res) => {
    console.log("archivePage");
    return res.sendFile(__dirname + "/public/archivePage/archivePage.html");
});




// Global middelware sits between backend and frontend. works on all routes
const firebase = require("./routes/firebase.js");

// Set up routes with our server
app.use(firebase);


// Port we listen to for incoming trafic
const port = process.env.PORT ? process.env.PORT : 8888;


// Error handling on server upstart
const server = app.listen(port, (error) => {
    if (error) {
        console.log("Error starting the server");
    }
    console.log("This server is running on port", server.address().port);
});

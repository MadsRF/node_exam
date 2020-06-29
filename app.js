// Initiliazing the server with the Express framework
const express = require("express");
const app = express();

// Makes public folder static, so it's always accessable    
app.use(express.static(__dirname + "/public"));

// A new body object containing the parsed data is populated on the request object after the middleware 
// (i.e. req.body). This object will contain key-value pairs, where the value can be a string or array 
// (when extended is false), or any type (when extended is true).
app.use(express.urlencoded({ extended: false }));

// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
app.use(express.json());

// The createServer method allows Node.js to act as a web server and receive requests 
const server = require("http").createServer(app);

// Socket.IO enables real-time bidirectional event-based communication.
const io = require("socket.io")(server);

// Helmet is a collection of 11 smaller middleware functions that set HTTP response headers. 
// Running app.use(helmet()) will not include all of these middleware functions by default. 
const helmet = require("helmet");
app.use(helmet());

// Used to avoid cross site scripting. (dosen't work because i'm sending a object and not a string)
// const escape = require("escape-html");

// listen for messages on server and broadcast/sends back to all users 
io.on("connection", socket => {

    socket.on("SentMessage", (data) => {
        
        // Goes out to all
        io.emit("receivedMessage", { userMessage: data.userMessage });
        console.log(data.userMessage)

        // send to own socket
        //socket.emit("A client said", data);
        
        // sends to all other sockets than the one who sent it 
        //socket.broadcast.emit("A client said", data);
   
    });
});


// Used to be able to establish permission for the user to enter the site and also be able to track them
const session = require("express-session");
const config = require("./configuration/config.json");
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));


// Objection.js is built on an SQL query builder called knex. All databases supported by knex are supported by objection.js. SQLite3,
// Setup Knex with Objection 
const { Model } = require('objection');
const Knex = require('knex');
const knexfile = require('./knexfile.js');
const knex = Knex(knexfile.development);

Model.knex(knex);


// Function for checking session id on routes request 
function checkAuth(req, res, next) {
    if (req.session.user_id != config.sessionSecret)  {
      res.status(401).sendFile(__dirname + "/public/noAuthPage/noAuthPage.html");
    } else {
        //console.log(req.session.user_id + " = " + config.sessionSecret);
        next();
    };
};

// Get routes for pages 
app.get(("/"), (req, res) => {
    console.log("login");
    return res.sendFile(__dirname + "/public/loginPage/loginPage.html");
});

app.get("/orderPage", checkAuth, (req, res) => {
    console.log("orderPage");
    return res.sendFile(__dirname + "/public/orderPage/orderPage.html");
});

app.get(("/itemPage"), checkAuth, (req, res) => {
    console.log("itemPage");
    return res.sendFile(__dirname + "/public/itemPage/itemPage.html");
});

app.get(("/addItemPage"), checkAuth, (req, res) => {
    console.log("addItemPage");
    return res.sendFile(__dirname + "/public/addItemPage/addItemPage.html");
});

app.get(("/archivePage"), checkAuth, (req, res) => {
    console.log("archivePage");
    return res.sendFile(__dirname + "/public/archivePage/archivePage.html");
});

app.get(("/messagePage"), checkAuth, (req, res) => {
    console.log("messagePage");
    return res.sendFile(__dirname + "/public/messagePage/messagePage.html");
});

app.get(("/profilePage"), checkAuth, (req, res) => {
    console.log("profilePage");
    return res.sendFile(__dirname + "/public/profilePage/profilePage.html");
});


// Global middelware sits between backend and frontend. works on all routes
const firebase = require("./routes/firebase.js");
const authRoute = require('./routes/auth.js');
const profileRoute = require('./routes/profile.js');

// Set up routes with our server
app.use(firebase);
app.use(authRoute);
app.use(profileRoute);


// Port we start our server on and listen to for incoming trafic
// Uses process.env.Port to change port when running diff. scripts
const port = process.env.PORT ? process.env.PORT : 8888;

// Error handling on server upstart
server.listen(port, (error) => {
    if (error) {
        console.log("Error starting the server");
    }
    console.log("This server is running on port", server.address().port);
});

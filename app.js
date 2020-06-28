// Framework for our server
const express = require("express");
const app = express();

/* Middelware */ 
// Makes public folder static, so it's always accessable    
app.use(express.static(__dirname + "/public"));

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
 
// parse application/json
app.use(express.json());


/* The createServer method allows Node.js to act as a web server and receive requests */
const server = require("http").createServer(app);

const io = require("socket.io")(server);


/*Helmet is a collection of 11 smaller middleware functions that set HTTP response headers. 
Running app.use(helmet()) will not include all of these middleware functions by default.*/ 
const helmet = require("helmet");
app.use(helmet());

// used to avoid cross site scripting
// const escape = require("escape-html");


io.on("connection", socket => {

    socket.on("SentMessage", (data) => {
        
        // Goes out to all
        io.emit("receivedMessage", { userMessage: data.userMessage });
        console.log(data.userMessage)
   
    });
});







// You need to copy the config.template.json file and fill out your own secret
const session = require("express-session");
const config = require("./configuration/config.json");
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true
}));



/* Setup Knex with Objection */
const { Model } = require('objection');
const Knex = require('knex');
const knexfile = require('./knexfile.js');
const knex = Knex(knexfile.development);

Model.knex(knex);

function checkAuth(req, res, next) {
    if (req.session.user_id != config.sessionSecret)  {
      res.status(401).sendFile(__dirname + "/public/noAuthPage/noAuthPage.html");
    } else {
        //console.log(req.session.user_id + " = " + config.sessionSecret);
        next();
    };
};

// Routes 
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
    return res.sendFile(__dirname + "/public/itemPage/addItemPage/addItemPage.html");
});


app.get(("/archivePage"), checkAuth, (req, res) => {
    console.log("archivePage");
    return res.sendFile(__dirname + "/public/archivePage/archivePage.html");
});

app.get(("/messagePage"), checkAuth, (req, res) => {
    console.log("messagePage");
    return res.sendFile(__dirname + "/public/messagePage/messagePage.html");
});




// Global middelware sits between backend and frontend. works on all routes
const firebase = require("./routes/firebase.js");
const authRoute = require('./routes/auth.js');

// Set up routes with our server
app.use(firebase);
app.use(authRoute);



// Port we listen to for incoming trafic
const port = 8888;

// Error handling on server upstart
server.listen(port, (error) => {
    if (error) {
        console.log("Error starting the server");
    }
    console.log("This server is running on port", server.address().port);
});

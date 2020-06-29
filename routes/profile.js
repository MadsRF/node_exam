// Use the express.Router class to create modular, mountable route handlers. 
// A Router instance is a complete middleware and routing system; for this reason, it is often referred to as a “mini-app”.
const router = require('express').Router();

const User = require("../models/User.js");

// Connects to the session secret  
const sessionId = require("../configuration/config.json");


// A library to help you hash passwords.
const bcrypt = require('bcrypt');
// When you are hashing your data the module will go through a series of rounds to give you a secure hash.
const saltRounds = 12;

// Function for checking session id on routes request 
function checkAuth(req, res, next) {
    if (req.session.user_id != sessionId.sessionSecret)  {
      res.status(401).sendFile(__dirname + "/public/noAuthPage/noAuthPage.html");
    } else {
        next();
    };
};

// Route with query for getting information about the current user logged in
router.get("/currentProfile", checkAuth, (req, res) => {
    
    const foundUser = {
        username: req.session.username,
        password: req.session.password
    };

    return res.send({ foundUser });
    
});

// Route with query for altering information about the current user logged in
router.post("/editProfile", checkAuth, (req, res) => {

    const { username, password } = req.body;
    
    //console.log(username, password)
    
    if (username && password) {
        
        if (password.lenght < 8) {
            return res.status(400).send({ response: "Password must be 8 characters or longer" });
        }    
        else{
            bcrypt.hash(password, saltRounds).then(hashedPassword => {
                User.query().where("username", req.session.username).update({
                    username: username,
                    password: hashedPassword,
                }).then(updatedUser => {
                    console.log("User with id:", updatedUser, "was updated");
                    req.session.username = username;
                    req.session.password = password; 

                    return res.status(202).send(true);   
                });       
            });
        };
    };
});

// Used to export routes so they are accessible 
module.exports = router;
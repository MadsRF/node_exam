const router = require('express').Router();

const User = require("../models/User.js");
const config = require("../configuration/config.json");

const bcrypt = require('bcrypt');
const saltRounds = 12;


function checkAuth(req, res, next) {
    if (req.session.user_id != config.sessionSecret)  {
      res.status(401).sendFile(__dirname + "/public/noAuthPage/noAuthPage.html");
    } else {
        next();
    };
};

// query for getting information about the current user logged in
router.get("/currentProfile", checkAuth, (req, res) => {
    
    const foundUser = {
        username: req.session.username,
        password: req.session.password
    };

    return res.send({ foundUser });
    
});


router.post("/editProfile", (req, res) => {

    const { username, password } = req.body;
    
    //console.log(username, password)
    
    if (username && password) {
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
     

});


module.exports = router;
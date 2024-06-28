const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbURI = process.env.MONGODB_URI;
console.log("Connecting to database at", dbURI);
mongoose.connect(
    dbURI,
);

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});

app.get("/Login", function (req, res) {
    res.sendFile(__dirname + "/Login.html");
});

app.get("/Registration", function (req, res) {
    res.sendFile(__dirname + "/Registration.html");
});

app.get("/userProfile" , function(req,res){
    res.sendFile(__dirname + "/userProfile.html");
});


const User = mongoose.model("User", {
    name: String,
    email: String,
    password: String,
    bankbalance: Number
});

async function findUser(email_in) {
    const user = await User.findOne({ email: email_in }).exec();
    console.log(user); // This prints the actual user document if found, or null if not found
    return user;
}


app.post("/Registration", async function (req, res) {

    try {
        let foundUser = await findUser(req.body.email);
        if(foundUser != null){
            res.send("User already exists");
        }
        else{
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                bankbalance: 0
            });
            newUser.save();
            console.log("New user saved:", newUser);
            res.redirect("http://localhost:3000/Login");
        }
        

    } catch (error) {
        console.error("Error saving new user:", error);
        res.status(500).send("Internal Server Error");
    }
});

const currentUser = mongoose.model("currentUser", {
    email: String,
    password: String
});

app.post("/Login", async function (req, res) {
    try {
        let foundUser = await findUser(req.body.email);
        if(foundUser != null){
            if(foundUser.password == req.body.password){
                res.redirect("http://localhost:3000/userProfile/?email="+req.body.email);
            }
            else{
                res.send("Incorrect Password");
            }
        }
        else{
            res.send("User not found");
            console.log(req.body);
        }
    } catch (error) {
        console.error("Error saving new user:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.get('/user', async (req, res) => {
    const email = req.query.email;
    try {
        const user = await User.findOne({ email: email }).exec();
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
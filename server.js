const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(
    "mongodb+srv://ansh7026:sgSjYzg0Z3LYXeNc@cluster0.ynj7jhm.mongodb.net/bankdata",
);

app.listen(3000, function () {
    console.log("Server is running on port 3000");
});

app.get("/Login.html", function (req, res) {
    res.sendFile(__dirname + "/Login.html");
});

app.get("/Registration.html", function (req, res) {
    res.sendFile(__dirname + "/Registration.html");
});

app.get("/userProfile.html" , function(req,res){
    res.sendFile(__dirname + "/userProfile.html");
});


const User = mongoose.model("User", {
    name: String,
    email: String,
    password: String
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
                password: req.body.password
            });
            newUser.save();
            console.log("New user saved:", newUser);
            res.redirect("http://localhost:3000/Login.html");
        }
        

    } catch (error) {
        console.error("Error saving new user:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/Login", async function (req, res) {
    try {
        let foundUser = await findUser(req.body.email);
        if(foundUser != null){
            if(foundUser.password == req.body.password){
                res.redirect("http://localhost:3000/userProfile.html");
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

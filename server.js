const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(
    "mongodb+srv://ansh7026:sgSjYzg0Z3LYXeNc@cluster0.ynj7jhm.mongodb.net/bankdata/"
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.listen(5500, function () {
    console.log("Server is running on port 5500");
});

const User = mongoose.model("User", {
    name: String,
    email: String,
    password: String
});

app.post("/Registration", function (req, res) {
    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        newUser.save();
        res.redirect("http://127.0.0.1:5501/Login.html");
    } catch (error) {
        console.error("Error saving new user:", error);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/Login", async function (req, res) {
    const loginUsername = JSON.stringify(req.body.loginusername);
    const loginPassword = JSON.stringify(req.body.loginpassword);
    try {
        const foundUser = await User.findOne({ email: loginUsername });

        if (foundUser) {
            if (foundUser.password !== loginPassword) {
                res.status(401).send("Invalid Password");
            } else {
                res.redirect("http://127.0.0.1:5501/userProfile.html");
            }
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});

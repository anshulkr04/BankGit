const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(
    "mongodb+srv://ansh7026:sgSjYzg0Z3LYXeNc@cluster0.ynj7jhm.mongodb.net/bankdata",
);

app.listen(5500, function () {
    console.log("Server is running on port 5500");
});

const User = mongoose.model("User", {
    name: String,
    email: String,
    password: String
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
            res.redirect("http://127.0.0.1:5501/Login.html");
        }
        

    } catch (error) {
        console.error("Error saving new user:", error);
        res.status(500).send("Internal Server Error");
    }
});
const express = require('express')
const bcrypt = require('bcrypt');
const userModel = require('./Models/Usermodel');
const port=process.env.PORT
require('dotenv').config();
const app = express()
app.use(express.json());
require('./DB/Conn')

// see all data from the database
app.get('/getUsers', async (req, res) => {
    try {
        const resp = userModel.find({}, (err, result) => {
            if (err)
                res.json(err);
            res.json(result);
        })
    } catch (error) {
        console.log(error);
    }
})


// register a new user in database
app.post('/register', async (req, res) => {
    try {
        const user = req.body;
        // hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        const newUser = new userModel({ name: user.name, password: hashedPassword });
        newUser.save();
        res.json(user);
    } catch (error) {
        console.log(error);
    }
})

// login a existing user
app.post('/login', async (req, res) => {

    try {
        // any field is missing
        if (!req.body.name || !req.body.password)
            return res.json("Fill the details");

        // if name is in database or not
        const lgnDtl = await userModel.findOne({ name: req.body.name });

        // if name is found in database
        if (lgnDtl) {
            // verifiying the password
            const pwdMth = await bcrypt.compare(req.body.password, lgnDtl.password);

            if (!pwdMth) {
                res.json("Invalid credentials");
            }
            else {
                res.json("Sign in successful");
            }
        }
        else {
            res.json("Invalid credentials");
        }
    } catch (error) {
        console.log(err);
    }

})
app.listen(port, () => {
    console.log("Server is running....")
})
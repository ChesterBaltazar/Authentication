import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from './models/User.js';

const app = express();
app.use(express.json());

app.get("/users", (req, res)=>{
    res.render("Login");
})

app.post("/Users", async(req, res) => {
    try {
        const { name, password } = req.body;
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            password: hashed
        });
        await newUser.save();
        res.status(201).json({ message: "User saved to MongoDB Atlas!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/Users/Login", async(req, res) => {
    try {

        const { name, password } = req.body;
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(400).json({ message: "Cannot find user" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.status(200).json({ message: "Login successful"});
        } else {
            res.status(401).json({ message: "Not allowed" });
        }
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

mongoose.connect("mongodb+srv://naomi56:naruto14*@chester.eoj8gbx.mongodb.net/?appName=Chester")
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error(err));

const port = 4050;
app.listen(port, () => console.log(`Server running: http://localhost:${port}`));

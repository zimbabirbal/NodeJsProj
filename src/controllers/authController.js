const user = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async(req, res) =>{
    try{
        const {username, password, role} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new user({username, password: hashedPassword, role});

        await newUser.save();

        return res
        .status(201)
        .json({message: `User register with username: ${username}`});
    }
    catch(err){
        return res
        .status(500)
        .json({message: `Server failed`});
    }
}

const login = async(req, res) =>{
    try{
        const { username, password} = req.body;

        const curUser = await user.findOne({username});

        if(!curUser){
            return res.status(404).
            json({message: `User with username ${username} not found.`});
        }

        const isMatch = await bcrypt.compare(password, curUser.password);

        if(!isMatch){
            return
                res
                .status(400)
                .json({message: `password didn't matched`});
        }

        const token = jwt.sign({id: curUser._id, role: curUser.role}, process.env.JWT_SECRET, {expiresIn: "1h"});

        return res.status(200).json({token});
    }
    catch(err){
        console.log("birbal=", err);
        return res
                .status(404)
                .json({message: `User with username ${username} not found.`});
    }
}

module.exports = {
    register,
    login
}
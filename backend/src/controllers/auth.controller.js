import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res) => {                           
    const {email, fullname, password} = req.body;   

    try {

        if(!fullname || !email || !password) {
            return res.status(400).json({msg : "All fields are Required"})
        }

        if(password.length < 6){
            return res.status(400).json({ msg: "Password must be more than 6 charaters" })
        }

        const user = await User.findOne({email});

        if(user) {
            return res.status(400).json({ msg: "Email Already Exists" }) 
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        })

        if(newUser) {
            //generate a Jwt Token
            generateToken(newUser._id,res);
            await newUser.save(); //User Create in the Database
         
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic
            })
        }
        else{
            res.status(400).json({msg: "Invalid User Data"})
        }

    } catch (error) {
        console.log("Error in SignUp Controller", error.message)
        res.status(500).json({ msg:"Internal Server Error" })
    }
}

export const login = async (req,res) => {
    
    const {email, password} = req.body;

    try {
        
        if( !email || !password) {
            res.status(400).json({ msg: "All fields Required"})
        }

        const user = await User.findOne( {email: email} )

        if(!user) {
            res.status(400).json({ msg: "No User found"})
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)

        if(!isPasswordCorrect) {
            res.status(400).json({ msg: "Password is Wrong"})
        } 

        generateToken(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullname,
            email: user.email,
            profilePic: user.profilePic,
        })

    } catch (error) {

        console.log("Error in Login Controller", error.message);
        res.status(500).json({msg: "Internal Server Error"})

    }
}

export const logout = (req,res) => {

    try {
        res.cookie("jwt","", {maxAge:0})
        res.status(200).json( {msg: "Loggout out Successfully"})
    } catch (error) {
        console.log("Error in Logout Controller", error.message)
    }
}

export const updateProfile = async (req,res) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if(!profilePic) {
            return res.status(400).json({ msg: "Profile Pic is required"})
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

        res.status(200).json(updatedUser)

    } catch (error) {
        res.status(500).json({msg: "Internal Server Error"});
        console.log("Error in Update Profile", error.message)
    }
}

export const checkAuth = (req,res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller" , error.message);
        res.status(500).json({ msg: "Internal Server Error"})
    }
}

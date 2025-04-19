import User from "..models/user.model.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async (req,res) => {                           
    const {email, fullname, password} = req.body;   

    try {
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

            const token = jwt.sign(username,process.env.SECRET_KEY)

            User.create(newUser)
        }
        else{
            res.status(400).json({msg: "Invalid User Data"})
        }

    } catch (error) {
        
    }
}

export const login = (req,res) => {
    res.send("Login Route")
}

export const logout = (req,res) => {
    res.send("logout route")
}
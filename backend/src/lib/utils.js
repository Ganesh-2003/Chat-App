import jwt from "jsonwebtoken"

export const generateToken = (userId,req,res) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET)
}


export const signup = (req,res) =>{

    const {email, fullname, password} = req.body;   

    try {
  

    } catch (error) {
        
    }
}

export const login = (req,res) => {
    res.send("Login Route")
}

export const logout = (req,res) => {
    res.send("logout route")
}
const jwt = require("jsonwebtoken");
require("dotenv").config();

const roleMiddleware = (roles) => {
    return (req,res,next) => {
        let token = req.header("Authorization")?.split(" ")[1]; 
        console.log(token);
        if (!token) {
            return res.status(400).send({ message: "Access denied. No token provided." });
        }
    
        try {
            let data = jwt.verify(token, process.env.JWT_SECRET);
            if(roles.includes(data.role)){
                req.userId = data.id;
                req.userRole = data.role 
                next();
            }else{
                res.status(401).json({message: "Not allowed"});
            }
        } catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }

    }
};

module.exports = roleMiddleware;

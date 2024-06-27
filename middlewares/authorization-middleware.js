const jwt = require("jsonwebtoken");

module.exports = {
    
    VerifyAccessToken :(req, res, next) => {
    
        const token = req.header("Authorization");
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No token provided" });
        }
    
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.tokenPayload = decoded; 
            next(); 
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
    },


    VerifyRefreshToken :(req, res, next) => {
    
        const token = req.header("Authorization");
        if (!token) {
            return res
                .status(401)
                .json({ message: "Unauthorized - No token provided" });
        }
    
        try {
            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            req.tokenPayload = decoded; 
            // console.log(decoded);
            next(); 
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
    },


};

const jwt = require("jsonwebtoken");

function extractToken(authHeader) {
	if (!authHeader) return null;

	const parts = authHeader.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer") {
		console.error("Invalid Authorization header format");
		return null;
	}

	return parts[1];
}

module.exports = {
    VerifyAccessToken :(req, res, next) => {
        const authHeader = req.header("Authorization");
        
        if (!authHeader) {
			console.log("Invalid authorization");
			return res
				.status(401)
				.json({ message: "Unauthorized - No token provided" });
		}
        
        const token = extractToken(authHeader);
        try {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.payload = decoded; 
            next(); 
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
    },


    VerifyRefreshToken :(req, res, next) => {
    
        const authHeader = req.header("Authorization");
        if (!authHeader) {
			return res
				.status(401)
				.json({ message: "Unauthorized - No token provided" });
        }
        
        const token = extractToken(authHeader);
        try {
            const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            req.payload = decoded; 
            // console.log(decoded);
            next(); 
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: "Unauthorized - Invalid token" });
        }
    },

};

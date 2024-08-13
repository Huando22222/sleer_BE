const jwt = require("jsonwebtoken");

function extractToken(authHeader) {
	if (!authHeader) {
		return null;
	}

	const parts = authHeader.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer") {
		console.error("Invalid Authorization header format");
		return null;
	}

	return parts[1];
}

const socketAuthMiddleware = (socket, next) => {
	const token = extractToken(socket.handshake.headers.authorization);

	if (token) {
		try {
			const decoded = jwt.verify(
				token,
				process.env.ACCESS_TOKEN_SECRET
				);
			socket.tokenPayload = decoded;
			socket.isAuthenticated = true;
		} catch (error) {
			console.error("Invalid token:", error.message);
			socket.isAuthenticated = false;
		}
	} else {
		socket.isAuthenticated = false;
	}
	next();
};

module.exports 	= socketAuthMiddleware;

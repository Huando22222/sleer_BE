// const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const route = require("./routes/index-routes");
const port = 3000;

////socket zone
const server = require("http").Server(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "http://localhost:3000",
	},

	pingInterval: 5000, 
	pingTimeout: 2000,
});

// require('./sockets/chat')(io);
require('./sockets/post-chat')(io);

app.use((req, res, next) => {
	req.io = io;
	next();
});

app.use(express.static('public'));


mongoose
	.connect(process.env.MONGO_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() =>
		console.log(
			"db connected\n----------------------------------------------------"
		)
	);
	
app.use(cors());
// const corsOptionsRoute1 = {
// 	origin: "http://example.com/route1",
// 	methods: "GET,PUT",
// };
app.use(
	express.json({
		/*limit: "10mb",*/
	})
);
app.use(express.urlencoded({ /*limit: "10mb",*/ extended: true }));

route(app);
server.listen(process.env.PORT || port, () =>
	console.log(
		`
		Example app listening on port ${process.env.PORT}!
		http://cmd => ipconfig:${process.env.PORT}`
	)
);

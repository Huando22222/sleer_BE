const userRouter = require("./user-routes");
const postsRouter = require("./post-routes");
const postsLocationRouter = require("./post-location-routes");

function route(app) {
	app.use("/user", userRouter);
	app.use("/post", postsRouter);
	app.use("/post-location", postsLocationRouter);
	
}

module.exports = route;

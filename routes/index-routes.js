const userRouter = require("./user-routes");
const postsRouter = require("./post-routes");
const postsLocationRouter = require("./post-location-routes");
const errorMiddleware = require("../middlewares/error-middleware");
function route(app) {
	app.use("/user", userRouter);
	app.use("/post", postsRouter);
	app.use("/post-location", postsLocationRouter);
	app.use(errorMiddleware);
}
	
module.exports = route;

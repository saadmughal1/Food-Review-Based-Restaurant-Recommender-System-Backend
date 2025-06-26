import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.handler.middleware.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
import UserRouter from "./routes/user.routes.js";
import PlaceRouter from "./routes/place.routes.js";
import PreferenceRouter from "./routes/preference.routes.js";
import ReviewRouter from "./routes/review.routes.js";
import LikeRouter from "./routes/like.routes.js"
import RecommendationRouter from "./routes/recommentation.routes.js"
import AdminRouter from "./routes/admin.routes.js"

app.use("/api/user/", UserRouter);
app.use("/api/place/", PlaceRouter);
app.use("/api/preference/", PreferenceRouter);
app.use("/api/review/", ReviewRouter);
app.use("/api/like/", LikeRouter);
app.use("/api/recommendation/", RecommendationRouter)
app.use("/api/admin/", AdminRouter)


app.use("/", (_, res) => res.send("server is running"));

app.use(errorHandler);

export default app;

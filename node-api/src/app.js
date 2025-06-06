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

app.use("/api/user/", UserRouter);
app.use("/api/place/", PlaceRouter);
app.use("/api/preference/", PreferenceRouter);
app.use("/api/review/", ReviewRouter);


app.use("/", (_, res) => res.send("server is running"));

app.use(errorHandler);

export default app;

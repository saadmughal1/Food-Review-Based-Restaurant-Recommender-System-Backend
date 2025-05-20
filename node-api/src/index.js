import dotenv from "dotenv";
dotenv.config({ path: "./env" });

import app from "./app.js";
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});

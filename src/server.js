import express from "express";
import dotenv from "dotenv";

// Load environment variables once at application entrypoint.
// Use the literal string 'local' as the default environment name.
dotenv.config({ path: `.env.${process.env.NODE_ENV || "local"}` });

const port = process.env.PORT || 8000;
const app = express();

// Parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dynamically import modules that expect process.env to be ready.
import connection from "./shared/database/connection.js";
import indexRoute from "./routes/index.js";

// ensure the connection module executed
connection();

// middleware and routes
app.use("/api", indexRoute);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

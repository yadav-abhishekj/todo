import express from "express";
import dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV || local}` });
const port = process.env.PORT || 8000;
const server = express();

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

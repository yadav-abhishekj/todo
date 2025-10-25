import mongoose from "mongoose";

async function connection() {
  mongoose
    .connect(process.env.DATABASE_CONNECTION, { dbName: process.env.DB_NAME })
    .then(() => {
      console.log("Connection established with the database");
    })
    .catch((error) => {
      console.log("Failed to connect with the database", error);
    });
}
export default connection;

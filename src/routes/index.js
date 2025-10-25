import express from "express";
import Todo from "./todo/todo.route.js";
const appRouteIndex = express();

appRouteIndex.use("/todo", Todo);

export default appRouteIndex;

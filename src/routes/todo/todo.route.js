import express from "express";
import Router from "../../controller/todo/todo.controller.js";
const router = express.Router();

router.get(["/list", "/list/:id"], Router.listing);
router.post("/add", Router.addTodo);
router.patch("/update/:id", Router.updateTodo);
router.delete("/delete/:id", Router.deleteTodo);

export default router;

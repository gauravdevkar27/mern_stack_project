const ToDo = require("../models/ToDoList.models.js");

// Custom async handler to replace express-async-handler
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

//create task
exports.createToDo = asyncHandler(async (req, res) => {
   const data = req.body;
   const { userId } = req.user; // from authenticateToken middleware
   const todo = new ToDo({...data, createdBy: userId});
   const result = await todo.save();
   res.status(201).send({message: "Created New Task!", data: result});
});

exports.getAllToDo = asyncHandler(async (req, res) => {
   const { userId } = req.user; // from authenticateToken middleware
   const todos = await ToDo.find({ createdBy: userId });
   res.status(200).send({ message: "Tasks fetched successfully!", data: todos });
});

exports.deleteToDo = asyncHandler(async (req, res) => {
   const { userId } = req.user;
   const { id } = req.params;
   const deletedTodo = await ToDo.findOneAndDelete({ _id: id, createdBy: userId });
   
   if (!deletedTodo) {
      res.status(404);
      throw new Error("Task not found or unauthorized");
   }
   
   res.status(200).send({ message: "Task deleted successfully!", data: deletedTodo });
});

exports.updateToDo = asyncHandler(async (req, res) => {
   const { userId } = req.user;
   const { id } = req.params;
   const updateData = req.body;

   // Prevent a user from changing the owner of the task
   delete updateData.createdBy;

   // If the task is being marked as completed, set the completedOn date.
   // If it's being marked as not completed, clear the date.
   if (updateData.isCompleted === true) {
      updateData.completedOn = new Date();
   } else if (updateData.isCompleted === false) {
      updateData.completedOn = null;
   }
   
   const updatedTodo = await ToDo.findOneAndUpdate(
      { _id: id, createdBy: userId },
      updateData,
      { new: true, runValidators: true }
   );
   
   if (!updatedTodo) {
      res.status(404);
      throw new Error("Task not found or unauthorized");
   }
   
   res.status(200).send({ message: "Task updated successfully!", data: updatedTodo });
});
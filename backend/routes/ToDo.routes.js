const express = require('express');
const {createToDo,getAllToDo,deleteToDo,updateToDo } = require('../controllers/ToDo.controllers');
const authenticateToken = require('../middleware/authjwt');
const router = express.Router();

router.post('/create-to-do', authenticateToken, createToDo);
router.get('/get-all-to-do',authenticateToken, getAllToDo);
router.delete('/delete-to-do/:id', authenticateToken, deleteToDo);
router.patch('/update-to-do/:id', authenticateToken, updateToDo);


module.exports = router;
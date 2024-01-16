const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const TodoModel = require('./Models/Todo.js');


const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://Admin1:Adminpass2412@cluster0.tgztujp.mongodb.net/TodoDB')

//get all Todos
app.get('/get', (req, res) => {
  TodoModel.find()
  .then(result => res.json(result))
  .catch(err => res.json(err))
})

//Update a todo status
app.put('/update/:id', (req, res) => {
  const id = req.params.id;
  TodoModel.findByIdAndUpdate(id, req.body, { new: true })
    .then(updatedTodo => res.json(updatedTodo))
    .catch(err => res.status(500).json(err));
  console.log(id);
});

//Add a todo
app.post('/add', (req, res) => {
  const todo = req.body.todo;
  //Create todo based on schema
  TodoModel.create({
    todo: todo})
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err)); //Sends back server error status if there is an error
});

//
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  //Find the todo by ID and delete it
  TodoModel.findByIdAndDelete(id)
  .then(() => res.json({ message: 'Todo deleted successfully' }))
  .catch(err => res.status(500).json(err));
})

app.listen(3001, () => {
  console.log("Server is running 🚀")
})

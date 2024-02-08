const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/todolist', { useNewUrlParser: true, useUnifiedTopology: true });

const todoSchema = new mongoose.Schema({
  text: String,
  completed: Boolean,
});

const TodoModel = mongoose.model('Todo', todoSchema);

app.get('/get', async (req, res) => {
  try {
    const todos = await TodoModel.find();
    res.json(todos);
  } catch (err) {
    console.error('Error fetching todos:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/add', async (req, res) => {
  try {
    const { text } = req.body;
    const newTodo = new TodoModel({ text, completed: false });
    await newTodo.save();
    res.json(newTodo);
  } catch (err) {
    console.error('Error adding todo:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await TodoModel.findByIdAndDelete(id);
    res.json({ message: 'Todo deleted successfully' });
  } catch (err) {
    console.error('Error deleting todo:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

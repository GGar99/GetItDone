const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const TodoModel = require('./Models/Todo.js')
const bcrypt = require('bcryptjs')
const User = require('./Models/User.js')
const jwt = require('jsonwebtoken')
const secretKey = process.env.JWT_SECRET || 'my-secret-key';


const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect('mongodb+srv://Admin1:Adminpass2412@cluster0.tgztujp.mongodb.net/TodoDB')

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.log('No token provided');
    return res.sendStatus(401);
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log('Token verification error:', err.message);
      return res.sendStatus(403);
    }
    console.log('User from token:', user);
    req.user = user;
    next();
  });
};

// Get Todos Route
// In the /get route
app.get('/get', authenticateToken, (req, res) => {
  const userId = req.user.userId; // Get user ID from the JWT token

  TodoModel.find({ user: userId })
      .populate('user', 'username') // Populate the 'username' field from the User model
      .then(result => {
          res.json(result); // Send back the result without modifying the todo text
      })
      .catch(err => res.status(500).json(err));
});



//Update a todo status
app.put('/update/:id', authenticateToken, (req, res) => {
  const id = req.params.id;
  const userId = req.user.userId;
  const { todo, done } = req.body; // Destructure the todo text and done status from request body

  TodoModel.findOneAndUpdate(
    { _id: id, user: userId },
    { todo: todo, done: done }, // Update only the todo text and done status
    { new: true }
  )
  .then(updatedTodo => {
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found or user not authorized' });
    }
    res.json(updatedTodo);
  })
  .catch(err => res.status(500).json({ message: err.message }));
});


//Add Todo route
app.post('/add', authenticateToken, (req, res) => {
  const todoText = req.body.todo;
  const userId = req.user.userId;

  const newTodo = new TodoModel({
    todo: todoText,
    user: userId
  });

  newTodo.save()
    .then(savedTodo => {
      return TodoModel.findById(savedTodo._id).populate('user', 'username');
    })
    .then(populatedTodo => {
      res.json({
        ...populatedTodo.toObject(),
        todo: `${populatedTodo.todo} - Added by ${populatedTodo.user.username}`
      });
    })
    .catch(err => res.status(500).json({ message: err.message }));
});



//Delete todos
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  //Find the todo by ID and delete it
  TodoModel.findByIdAndDelete(id)
  .then(() => res.json({ message: 'Todo deleted successfully' }))
  .catch(err => res.status(500).json(err));
})

//user registration endpoint
app.post('/register', async (req, res) => {
  const { email, password, username } = req.body;
  console.log("Received registration request:", { email, password, username });

  try {
    // Log the received request body
    console.log("Received registration request:", req.body);

    // Check if user already exists
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      console.log("Missing fields in registration request.");
      return res.status(400).json({ message: 'Email, password, and username are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists with email:", email);
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save user to database
    const savedUser = await user.save();
    console.log("User registered successfully:", savedUser);

    // Send response (don't send back password)
    res.status(201).json({ userId: savedUser._id, email: savedUser.email });
  } catch (error) {
    console.error("Error in /register route:", error);
    res.status(500).json({ message: error.message });
  }
});

// In your server-side login route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.password)) {
      const payload = { userId: user._id };
      const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



app.listen(3001, () => {
  console.log("Server is running 🚀")
})

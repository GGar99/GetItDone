import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

function TodoApp() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3001/get', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      setTodos(data);
    })
    .catch(err => console.error(err));
  }, []);


  const addTodo = async (newTodoText) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:3001/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ todo: newTodoText }),
    });

    if (!response.ok) {
      const responseText = await response.text(); // Read the response once
      console.log('Response payload:', responseText); // Use the stored response
      throw new Error('Network response was not ok');
    }

    const addedTodo = await response.json(); // Read the response here if it's ok
    console.log('Added todo:', addedTodo);
    setTodos([...todos, { ...addedTodo, id: addedTodo._id }]);
  } catch (error) {
    console.error('Error in addTodo:', error);
  }
};



  const editTodo = (id, doneStatus) => {
    console.log('Current todos:', todos);

    const todo = todos.find((item) => item.id === id);
    if (!todo) {
      console.log('Todo item not found');
      return;
    }

    const updatedTodo = { ...todo, done: !todo.done }; // Update with todo text and done status

    const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage
    fetch(`http://localhost:3001/update/${todo._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Include the JWT token in the Authorization header
      },
      body: JSON.stringify(updatedTodo),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(updatedItem => {
      setTodos(todos.map((item) => item.id === id ? updatedItem : item));
    })
    .catch(err => console.log(err));
};

  const deleteTodo = async (id) => {
    console.log("ID received for deletion:", id); // For debugging

    if (!id) {
      console.error("Cannot delete todo without an ID.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo._id !== id)); // Remove the todo from the state using _id
        console.log("Deleted todo with ID:", id); // For debugging
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };
  console.log("Todos:", todos);

  return (
    <div className='form-list-container'>
      <TodoForm onAddTodo={addTodo} />
      <TodoList todos={todos} onEditTodo={editTodo} onDeleteTodo={deleteTodo} />
    </div>
  );
}

export default TodoApp;

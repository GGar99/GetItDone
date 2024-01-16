import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

function TodoApp() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    // Fetch todos from the backend
    fetch('http://localhost:3001/get')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const formattedTodos = data.map(todo => ({
          ...todo,
          id: todo._id
        }));
        setTodos(formattedTodos);
      })
      .catch(err => console.error(err));
  }, []);

  const addTodo = async (newTodoText) => {

    try {
      const response = await fetch('http://localhost:3001/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({todo: newTodoText}), //Send the task in the request body
      });

      if (response.ok) {
        const addedTodo = await response.json();
        console.log(addedTodo);
        setTodos([...todos, { ...addedTodo, id: addedTodo._id }]); // Add the new todo with formatted ID to the state
      } else {
        throw new Error('Network response was not ok'); //Handle http errors
      }
    } catch (error) {
      console.log(error); //Handle network errors

  }
  };

  const editTodo = (id, doneStatus) => {
    //log current todos to inspect them
    console.log('Current todos:', todos);
    //find todo item by id
    const todo = todos.find((item) => item.id === id);
    if (!todo) {
      console.log('Todo item not found');
      return;
    }

    //Toggle the 'done' status
    const updatedTodo = {...todo, done: !todo.done };

    //send the updated todo item to the server
    fetch(`http://localhost:3001/update/${todo._id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    })
    .then(response => {
      if(!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(updatedItem => {
      // Update the state with the new todo list
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

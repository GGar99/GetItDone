import React, { useState } from 'react';

function TodoForm({ onAddTodo }) {
  const [newTodo, setNewTodo] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      // Prevent adding empty todos
      return;
    }
    onAddTodo(newTodo); // Call the passed in function to add the todo
    setNewTodo(''); // Clear the input after adding a todo
  };

  return (
    <form className='todo-form' onSubmit={handleAdd}>
      <input
        type='text'
        name='newTodo'
        placeholder='... needs to be done'
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button type='submit'>Add</button>
    </form>
  );
}

export default TodoForm;

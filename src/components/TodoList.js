import React from 'react';
import { CircleFill, TrashFill } from 'react-bootstrap-icons';

function TodoList({ todos, onEditTodo, onDeleteTodo }) {
  return (
    <div className="todo-list">
      {todos.map(todo => (
        <div key={todo.id} className="todo-item">
          <span className={`todo-text ${todo.done ? 'completed' : ''}`} onClick={() => onEditTodo(todo.id)}>
            <CircleFill className='icon' />
            {todo.todo}
          </span>
          <span className="delete-icon" onClick={() => onDeleteTodo(todo.id)}>
            <TrashFill className='icon' />
          </span>
        </div>
      ))}
      {todos.length === 0 && <div>No todos yet. Add some tasks!</div>}
    </div>
  );
}

export default TodoList;

import React, { useState, useEffect } from 'react';
import './TodoList.css';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [error, setError] = useState('');

  
  useEffect(() => {
    fetchTasks();
  }, []);


  //Get all tasks
  async function fetchTasks() {
    try {
      const response = await fetch('http://localhost:4000/api/tasks/list');

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      console.log('Response data:', data); 

    
      if (data._value && Array.isArray(data._value)) {
        setTasks(data._value);
      } else {
        throw new Error('Invalid tasks format');
      }
    } catch (err) {
      setError(err.message);
    }
  }

  // Create a new task
  async function handleCreateTask(e) {
    e.preventDefault();

    if (!newTaskTitle.trim()) {
      setError('Task title cannot be empty.');
      return;
    }
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: newTaskTitle })
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const createdTask = await response.json();
      setTasks([...tasks, createdTask]);
      setNewTaskTitle('');
    } catch (err) {
      setError(err.message);
    }
  }

  // Delete a task
  async function handleDeleteTask(taskId) {
    try {
      const response = await fetch(`http://localhost:4000/api/tasks/remove/${taskId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  }

  // Start editing a task
  function startEditing(task) {
    setEditTaskId(task.id);
    setEditTaskTitle(task.title);
  }

  // Cancel editing
  function cancelEditing() {
    setEditTaskId(null);
    setEditTaskTitle('');
  }

  // Update a task title
  async function handleUpdateTask(e) {
    e.preventDefault();

    if (!editTaskTitle.trim()) {
      setError('Task title cannot be empty.');
      return;
    }
    setError('');

    try {
      const response = await fetch(`http://localhost:4000/api/tasks/update/${editTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: editTaskTitle })
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();

      // Update the task in the local state
      setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
      setEditTaskId(null);
      setEditTaskTitle('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggleStatus(task) {
    try {
      // Toggle the status
      const updatedStatus = !task.completed;
  
      const response = await fetch(`http://localhost:4000/api/tasks/update/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: updatedStatus }),
      });
  

      
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
  
      const updatedTask = await response.json();
  
      console.log('Updated task:', updatedTask);
  
    
      setTasks(tasks.map((t) => (t.id === updatedTask.id ? { ...t, completed: updatedStatus } : t)));
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="todo-list-container">
  <h2>To-do List <img src="lista-de-desejos.png" alt="To-do List" /></h2>
  {error && <p className="error">{error}</p>}

  {/* Create Task Form */}
  <form onSubmit={handleCreateTask} className="task-form">
    <input
      type="text"
      placeholder="New task title"
      value={newTaskTitle}
      onChange={(e) => setNewTaskTitle(e.target.value)}
      className="task-input"
    />
    <button type="submit" className="task-button">Create Task</button>
  </form>

  {/* Incomplete Tasks */}
  <h2>Incomplete Tasks</h2>
  <ul className="task-list">
    {tasks.filter(task => !task.completed).map((task) => (
      <li key={task.id} className="task-item">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => handleToggleStatus(task)}
          className="task-checkbox"
        />
        {editTaskId === task.id ? (
          <form onSubmit={handleUpdateTask} className="task-form edit-form">
            <input
              type="text"
              value={editTaskTitle}
              onChange={(e) => setEditTaskTitle(e.target.value)}
              className="task-input edit-input"
              onBlur={handleUpdateTask}
              autoFocus
            />
          </form>
        ) : (
          <span 
            className={`task-title ${task.completed ? 'completed' : ''}`} 
            onClick={() => startEditing(task)}
          >
            {task.title}
          </span>
        )}
        <button 
          onClick={() => handleDeleteTask(task.id)} 
          className="task-button delete"
        >
          Delete
        </button>
      </li>
    ))}
  </ul>

  {/* Completed Tasks */}
  <h2>Completed Tasks</h2>
  <ul className="task-list">
    {tasks.filter(task => task.completed).map((task) => (
      <li key={task.id} className="task-item">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => handleToggleStatus(task)}
          className="task-checkbox"
        />
        {editTaskId === task.id ? (
          <form onSubmit={handleUpdateTask} className="task-form edit-form">
            <input
              type="text"
              value={editTaskTitle}
              onChange={(e) => setEditTaskTitle(e.target.value)}
              className="task-input edit-input"
              onBlur={handleUpdateTask}
              autoFocus
            />
          </form>
        ) : (
          <span 
            className={`task-title ${task.completed ? 'completed' : ''}`} 
            onClick={() => startEditing(task)}
          >
            {task.title}
          </span>
        )}
        <button 
          onClick={() => handleDeleteTask(task.id)} 
          className="task-button delete"
        >
          Delete
        </button>
      </li>
    ))}
  </ul>
</div>
  );
}

export default TodoList;
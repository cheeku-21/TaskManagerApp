import { useState, useEffect } from 'react';
import axios from 'axios';


export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    category: '',
    priority: 3, // Default to Low
  });

  // Fetch tasks from the backend
  useEffect(() => {
    async function fetchTasks() {
      const result = await axios.get('/api/tasks');
      setTasks(result.data);
    }
    fetchTasks();
  }, []);

  // Handle task form input
  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  // Add a new task
  const addTask = async () => {
    const result = await axios.post('/api/tasks', newTask);
    setTasks([...tasks, result.data]);
    setNewTask({ title: '', description: '', due_date: '', category: '', priority: 3 });
  };

  // Mark a task as completed or incomplete
  const toggleTaskCompletion = async (id, completed) => {
    const updatedTask = await axios.put('/api/tasks', { id, completed });
    setTasks(tasks.map(task => task.id === id ? updatedTask.data : task));
  };

  // Delete a task
  const deleteTask = async (id) => {
    await axios.delete('/api/tasks', { data: { id } });
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Prioritize tasks based on due date and priority
  const prioritizeTasks = (tasks) => {
    return tasks.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      return new Date(a.due_date) - new Date(b.due_date);
    });
  };

  const taskList = prioritizeTasks(tasks);

  // Calculate task completion progress
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  return (
    <div className="container">
      <h1>Task Manager</h1>

      {/* Task Creation Form */}
      <form>
        <input
          type="text"
          name="title"
          value={newTask.title}
          onChange={handleInputChange}
          placeholder="Task title"
        />
        <input
          type="text"
          name="description"
          value={newTask.description}
          onChange={handleInputChange}
          placeholder="Task description"
        />
        <input
          type="date"
          name="due_date"
          value={newTask.due_date}
          onChange={handleInputChange}
          placeholder="Due Date"
        />
        <input
          type="text"
          name="category"
          value={newTask.category}
          onChange={handleInputChange}
          placeholder="Category"
        />
        <select name="priority" value={newTask.priority} onChange={handleInputChange}>
          <option value={1}>High</option>
          <option value={2}>Medium</option>
          <option value={3}>Low</option>
        </select>
        <button type="button" onClick={addTask}>Add Task</button>
      </form>

      {/* Task Progress */}
      <div>
        <p>Progress: {progress}%</p>
        <div className="progress-container">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Task List */}
      <ul>
        {taskList.map(task => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Due Date: {task.due_date.slice(0,10)}</p>
            <p>Category: {task.category}</p>
            <p>Priority: {task.priority === 1 ? 'High' : task.priority === 2 ? 'Medium' : 'Low'}</p>
            <button onClick={() => toggleTaskCompletion(task.id, !task.completed)}>
              {task.completed ? "Unmark as Incomplete" : "Mark as Completed"}
            </button>
            <button onClick={() => deleteTask(task.id)}>Delete Task</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

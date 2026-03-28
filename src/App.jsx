import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");

  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) setTasks(saved);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(e) {
    e.preventDefault();
    if (!task.trim()) return;

    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: task,
        completed: false,
        priority,
        dueDate
      }
    ]);

    setTask("");
    setDueDate("");
    setPriority("Medium");
  }

  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  function toggleTask(id) {
    setTasks(
      tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }

  function startEdit(t) {
    setEditingId(t.id);
    setEditText(t.text);
  }

  function saveEdit() {
    setTasks(tasks.map(t =>
      t.id === editingId ? { ...t, text: editText } : t
    ));
    setEditingId(null);
  }

  function clearCompleted() {
    setTasks(tasks.filter(t => !t.completed));
  }

  const filteredTasks = tasks.filter(t => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  // Progress
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  return (
    <div className="container">
      <h1>TaskFlow</h1>

      {/* Progress */}
      <div className="progress">
        <p>{progress}% complete</p>
        <progress value={progress} max="100"></progress>
      </div>

      {/* Add Task */}
      <form onSubmit={addTask}>
        <input
          value={task}
          onChange={e => setTask(e.target.value)}
          placeholder="Add a task..."
        />

        <select value={priority} onChange={e => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />

        <button>Add</button>
      </form>

      {/* Filters */}
      <div className="filters">
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("completed")}>Completed</button>
        <button onClick={clearCompleted}>Clear Completed</button>
      </div>

      {/* Task List */}
      <ul>
        {filteredTasks.map(t => (
          <li key={t.id} className={t.completed ? "done" : ""}>
            
            {editingId === t.id ? (
              <>
                <input
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
                <button onClick={saveEdit}>Save</button>
              </>
            ) : (
              <>
                <span onClick={() => toggleTask(t.id)}>
                  {t.text}
                </span>

                <small> [{t.priority}] </small>
                {t.dueDate && <small> ({t.dueDate}) </small>}

                <button onClick={() => startEdit(t)}>Edit</button>
                <button onClick={() => deleteTask(t.id)}>❌</button>
              </>
            )}

          </li>
        ))}
      </ul>
    </div>
  );
}
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

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) setTasks(saved);
  }, []);

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

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  return (
    <div className="container">
      <div className="card">

        <h1>TaskFlow</h1>
        <p className="subtitle">
          Organize tasks with priority and deadlines
        </p>

        <div className="progress-box">
          <p>{progress}% complete</p>
          <progress value={progress} max="100"></progress>
        </div>

        <form className="task-form" onSubmit={addTask}>
          <input
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="Add a task..."
          />

          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
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

        <div className="filters">
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("active")}>Active</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={clearCompleted}>Clear</button>
        </div>

        {filteredTasks.length === 0 && (
          <p className="empty">No tasks yet</p>
        )}

        <ul className="task-list">
          {filteredTasks.map(t => (
            <li
              key={t.id}
              className={`task ${t.completed ? "done" : ""} ${
                t.dueDate && new Date(t.dueDate) < new Date() && !t.completed
                  ? "overdue"
                  : ""
              }`}
            >
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
                  <div className="task-left">
                    <span onClick={() => toggleTask(t.id)}>
                      {t.text}
                    </span>

                    <div className="task-meta">
                      <small className={`priority ${t.priority.toLowerCase()}`}>
                        {t.priority}
                      </small>

                      {t.dueDate && (
                        <small>{t.dueDate}</small>
                      )}
                    </div>
                  </div>

                  <div className="task-actions">
                    <button onClick={() => startEdit(t)}>Edit</button>
                    <button onClick={() => deleteTask(t.id)}>✕</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}